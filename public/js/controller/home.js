/*Data received from server*/
const token = "<%= userToken %>"
const DOC_NAME = "<%= user !== null ? user.uid : ''%>";
const restriction_enzymes = JSON.parse($("#restriction_enzymes").val());

window.onload = async ()=>{

    //If the page is refreshed and it is checked, display 2nd enzyme input
    if(doubleDigestInput[0].checked){
        secondEnzymeBlock.removeClass("display-none");
        enzymeSite2[0].required = true;
    }
};


/* Inputs */
const enzymeSite = $('#enzyme_site');
const enzymeSite2 = $('#enzyme_site2');
const probability = $('#probability');
const lengthDistribution = $('#length_distribution');
const graphRangeMin = $('#graph_range_min');
const graphRangeMax = $('#graph_range_max');
const focusRangeMin = $('#focus_range_min');
const focusRangeMax = $('#focus_range_max');
const outlierInput = $('#outlier');
const doubleDigestInput = $('#doubleDigest');
const genomeFileInput = $('#genome_file');

/* HTML elements*/
const analysisButton = $('#analysis_button');
const analysisLoadingBlock = $('#analysis_loading_block');
const progressBar = $('#progress_bar');
const fragmentTableContainer = $('#fragment_table_container');
const fragmentChartCanvas = $('#fragment_chart');
const secondEnzymeBlock = $("#secondEnzymeBlock");
const analysisForm = $('#analysis_form');


/* Chart/Graph Object */
let fragmentChartObject = null;


/* Prevent icon anchor defaults. Prevents from going to top of page on click*/
$("#icon-question-a").on("click", (event)=>{
    event.preventDefault();
    return false;
});

$("#icon-question-g").on("click", (event)=>{
    event.preventDefault();
    return false;
});



/* Input Utilities */
function showRestrictionSite2(checkbox){
    if(checkbox.checked){
        secondEnzymeBlock.removeClass("display-none");
        enzymeSite2[0].required = true;
    } else {
        secondEnzymeBlock.addClass("display-none");
        enzymeSite2[0].required = false;
    }
}


function updateToFixed(){
    let value = parseFloat(probability.val());
    if(!isNaN(value) && value >= 0.001 && value <= 1.000){
        probability.val(value.toFixed(3));
    }
}

function onSelectEnzyme(sel){
    if(sel.selectedIndex === 0){
        enzymeSite[0].disabled = false;
        enzymeSite.val("");

    } else {
        enzymeSite[0].disabled = true;
        enzymeSite.val(restriction_enzymes[sel.selectedIndex-1].restrictionSite);

    }
}

function onSelectEnzyme2(sel){
    if(sel.selectedIndex === 0){
        enzymeSite2[0].disabled = false;
        enzymeSite2.val("");
    } else {
        enzymeSite2[0].disabled = true;
        enzymeSite2.val(restriction_enzymes[sel.selectedIndex-1].restrictionSite);
    }
}

function parseRestrictionSite(site){
    const reg = new RegExp("[^\|ACTG]")
    let siteUpper = site.toUpperCase();

    const invalidCharIndex = siteUpper.search(reg);
    const pipes = siteUpper.match(/\|/g);
    const pipeCount = pipes !== null ? pipes.length : 0;

    if(pipeCount > 1 || invalidCharIndex !== -1){
        throw Error(`Invalid input for restriction site: ${site}`)
    } else {
        const pipeIndex = siteUpper.indexOf("|");
        let sliceOffset = null;
        if(pipeIndex !== -1){
            sliceOffset = pipeIndex;
            siteUpper = siteUpper.replace("|", "");
        } else {
            sliceOffset = siteUpper.length/2;
        }
        return {site: siteUpper, sliceOffset};
    }

}


/* Creates chart based off analysis of the analyzer*/
function displayChart(fragmentDistributions) {
    const chartLabels = [];
    const chartData = [];
    const backgroundColor = [];
    const borderColor = [];

    for(let i = 0; i < fragmentDistributions.length; i++){

        chartLabels.push(fragmentDistributions[i].range);
        chartData.push(`${fragmentDistributions[i].count}`);
        if(fragmentDistributions[i].focusArea){
            backgroundColor.push('rgba(30, 130, 76, 0.2)');
            borderColor.push('rgba(30, 130, 76, 1)');
        } else {
            backgroundColor.push('rgba(54, 162, 235, 0.2)');
            borderColor.push('rgba(54, 162, 235, 1.0)');
        }

    }
    
    fragmentChartObject = new Chart(fragmentChartCanvas, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Fragments',
                data: chartData,
                backgroundColor,
                borderColor,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Fragment Length (bp)"
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Fragment Count"
                    }
                }
            }
        }
    });
    
}


/* Analysis setup */
async function performAnalysis(){

    if (analysisForm[0].checkValidity()){

        console.log("Start")
        try{

            /* String inputs to numbers */
            let lengthDistributionNumber = parseInt(lengthDistribution.val());
            let graphRangeMinNumber = parseInt(graphRangeMin.val());
            let graphRangeMaxNumber = parseInt(graphRangeMax.val());
            let focusRangeMinNumber = parseInt(focusRangeMin.val());
            let focusRangeMaxNumber = parseInt(focusRangeMax.val());
            let probabilityNumber = parseFloat(probability.val());

            /* Validate range inputs */
            if(graphRangeMaxNumber < graphRangeMinNumber){
                graphRangeMax.val(`${graphRangeMinNumber}`);
                graphRangeMaxNumber = graphRangeMinNumber;
            }

            if(focusRangeMaxNumber > graphRangeMaxNumber){
                focusRangeMax.val(`${graphRangeMaxNumber}`);
                focusRangeMaxNumber = graphRangeMaxNumber;
            } else if (focusRangeMaxNumber < graphRangeMinNumber){
                focusRangeMax.val(`${graphRangeMinNumber}`);
                focusRangeMaxNumber = graphRangeMinNumber;
            }

            if(focusRangeMinNumber > focusRangeMaxNumber){
                focusRangeMin.val(`${focusRangeMaxNumber}`);
                focusRangeMinNumber = focusRangeMaxNumber;
            } else if(focusRangeMinNumber < graphRangeMinNumber){
                focusRangeMin.val(`${graphRangeMinNumber}`);
                focusRangeMinNumber = graphRangeMinNumber;
            }


            /* Parse and put enzyme inputs into an array */
            restrictionEnzymes = [];
            restrictionEnzymes.push(parseRestrictionSite(enzymeSite.val()));

            if(doubleDigestInput[0].checked){
                console.log("TREY");
                restrictionEnzymes.push(parseRestrictionSite(enzymeSite2.val()));
            }
        

            /* Create config for analyzer */
            let radConfig = {
                genomeFile: genomeFileInput[0].files[0],
                restrictionEnzymes,
                probability: probabilityNumber,
                lengthDistribution: lengthDistributionNumber,
                graphRangeMin: graphRangeMinNumber,
                graphRangeMax: graphRangeMaxNumber,
                focusRangeMin: focusRangeMinNumber,
                focusRangeMax: focusRangeMaxNumber,
                includeOutliers: outlierInput[0].checked,
            }

            /* Create analyzer. Configure callbacks */
            const analyzer = new RadSequencingAnalyzer(radConfig);

            analyzer.onBegin(()=>{
                progressBar.css("width", "0%");
                analysisLoadingBlock.removeClass("display-none");
                analysisButton.addClass("display-none");
                fragmentTableContainer.html("");
                if(fragmentChartObject !== null) {
                    console.log("Destroyed");
                    fragmentChartObject.destroy();
                }
            });

            analyzer.onProgress((percentage)=>{
                progressBar.css("width", `${percentage}%`);
            });

            analyzer.onResult((data)=>{
                analysisLoadingBlock.addClass("display-none");
                analysisButton.removeClass("display-none");

                //Build Data Table
                const builder = new DataTableBuilder(data);
                builder.addTable(createTotalTable(data));
                builder.addTable(createGraphRangeTable(data));
                builder.addTable(createFocusRangeTable(data));
                builder.addTable(createInputPropertiesTable(data));
                fragmentTableContainer.html(builder.build() + "<hr>");

                displayChart(data.fragmentDistributions);
            });

            analyzer.onReadError(()=>{
                analysisLoadingBlock.style.display = "none";
                analysisButton.style.display = "block";
            });

            analyzer.analyze(genomeFileInput[0].files[0])
        } catch(e) {
            alert(e);
        }
    } else {
        analysisForm[0].reportValidity()                
    }
}