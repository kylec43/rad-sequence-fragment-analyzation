//Analysis is done here.

/* Chart Object */
var fragmentChartObject = null;

window.radAnalyze = async function(config){

    if(config.restrictionSite2 !== null){
        doubleEnzymeDigest(config);
    } else {
        singleEnzymeDigest(config);
    }


}



// async function singleEnzymeDigest(config){

//     console.log("Single digest");
    
//     /* Get from config*/
//     let genomeFile = config.genomeFile;
//     let restrictionSite = config.restrictionSite1;
//     let probability = Math.floor(config.probability*100);
//     let lengthDistribution = config.lengthDistribution;
//     let graphRangeMin = config.graphRangeMin;
//     let graphRangeMax = config.graphRangeMax;
//     let includeOutliers = config.includeOutliers;
//     let fragmentTableContainer = config.fragmentTableContainer;
//     let fragmentChartCanvas = config.fragmentChartCanvas;
//     let progressBar = config.progressBar;
//     let hideThenShow = config.hideThenShow;
//     let showThenHide = config.showThenHide;

//     /*Initialize initial values */

//     if(progressBar){
//         progressBar.style.width = "0%";
//     }

//     fragmentTableContainer.innerHTML = ``;
//     if(fragmentChartObject !== null) {
//         console.log("Destroyed");
//         fragmentChartObject.destroy();
//     }
    

//     /* Hide these elements in the beginning, store their display history for the end */
//     var displayHistory = [];
//     for(let i = 0; i < hideThenShow.length; i++){
//         displayHistory.push(hideThenShow[i].style.display);
//         hideThenShow[i].style.display = "none"
//     }

//     console.log(`File size is: ${genomeFile.size} bytes`);
//     console.log(`Restriction Site is: ${restrictionSite}`);
//     console.log(`Probability is: ${probability}`)
//     console.log("Initializing File Reader")

//     var reader = new FileReader();
//     var fragmentCount = 0;

//     /* run this function on file read */
//     console.log("Setting onload");
//     reader.onload = (function(reader)
//     {
//         return async function()
//         {
//             var date1 = new Date();

//             /*Get file text content */
//             console.log("Reading contents...")
//             var contents = reader.result.replace(/(\r\n|\n|\r)/gm, "");
//             console.log(`Result size is ${contents.length}`);

//             console.log(`Finding Restriction Site Count: ${restrictionSite}`)
//             var position = 0;
//             var totalSiteCount = 0;
//             var expectedSiteCount = 0;
//             var actualSiteCount = 0;
//             var fragmentRangeCount = 0;
//             console.log(`Position is ${position}, Contents length is ${contents.length}`);
//             var lastPercentage = 0;

            
//             /* Get the amount of distributions */
//             let distributionCount = Math.ceil((graphRangeMax-graphRangeMin)/lengthDistribution) + 2
//             let remainder = (graphRangeMax-graphRangeMin)%lengthDistribution;
//             if(remainder === 0){
//                 distributionCount += 1
//             }

//             /* Create an array to put the amount of fragments for each distribution */
//             var fragmentSizes = Array(distributionCount).fill(0)
//             var lastSliceIndex = 0;
//             var sliceOffset = restrictionSite.length/2;

//             /*Get the totalSiteCount, actualSiteCount, and fragment sizes in this loop */
//             while(position !== -1 && position < contents.length){

//                 //Find position of next site
//                 position = contents.indexOf(restrictionSite, position);

//                 //If site is -1, it does not exist in the rest of the file, 
//                 //Otherwise add to the totalSiteCount and actualSiteCount here
//                 if(position !== -1){
//                     totalSiteCount++;

//                     //Determine if this site was sliced based off of probability
//                     let randomNumber = Math.floor((Math.random() * 100) + 1);
//                     if(randomNumber <= probability){
//                         actualSiteCount++;

//                         let fragmentSize = position+sliceOffset - lastSliceIndex;

//                         if(fragmentSize >= graphRangeMin && fragmentSize <= graphRangeMax){
//                             let index = Math.floor((fragmentSize-graphRangeMin)/lengthDistribution) + 1
//                             if(index >= fragmentSizes.length){
//                                 index = fragmentSizes.length-1;
//                             }

//                             fragmentSizes[index]++;
//                             fragmentRangeCount++;
//                         } else if (fragmentSize < graphRangeMin){
//                             fragmentSizes[0]++;
//                         } else {
//                             fragmentSizes[fragmentSizes.length-1]++;
//                         }

//                         lastSliceIndex = position+sliceOffset;
//                     }

//                     //Set the new position to read the file from
//                     position += restrictionSite.length;                    
                    
//                     //Update the progress bar
//                     if(progressBar !== null){
//                         var percentage = position/(contents.length)
//                         percentage = percentage*100;
//                         percentage = Math.floor(percentage);
//                         if(lastPercentage !== percentage){
//                             lastPercentage = percentage;
//                             progressBar.style.width = `${percentage}%`;
//                         }
//                     }
//                 }
//             }

//             /* Add last fragment */
//             let fragmentSize = contents.length - lastSliceIndex;
//             if(fragmentSize >= graphRangeMin && fragmentSize <= graphRangeMax){
//                 let index = Math.floor((fragmentSize-graphRangeMin)/lengthDistribution) + 1
//                 if(index >= fragmentSizes.length){
//                     index = fragmentSizes.length-1;
//                 }
//                 console.log(`Index is ${index}`);
//                 fragmentSizes[index]++;
//                 fragmentRangeCount++;
//             } else if (fragmentSize < graphRangeMin){
//                 fragmentSizes[0]++;
//             } else {
//                 fragmentSizes[fragmentSizes.length-1]++;
//             }


//             /* Get fragment count and expected site count */

//             //Fragment count will be n + 1 where n is the actualSiteCount
//             fragmentCount = actualSiteCount + 1;

//             //expectedSiteCount will be totalSiteCount * probability decimal rounded down. I.E. e.g. 10 * 0.95 = 9 expected sites
//             expectedSiteCount = Math.floor(totalSiteCount * (probability/100))


//             /* Display data tables */
//             var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
//             fragmentTableContainer.innerHTML = `
//             <div class="row">
//                 <div class="col">
//                     <table class="rad-data-table">
//                         <tr>
//                             <th class="rad-th" title="Total RS Count = Number of Restriction Sites inside Genome File">Total RS Count</th>
//                             <th class="rad-th" title="Expected RS Slice Count = Total RS Count * Probability">Expected RS Slice Count</th>
//                             <th class="rad-th" title="Actual RS Slice Count = Slicing based off of probability">Actual RS Slice Count</th>
//                         </tr>
//                         <tr>
//                             <td class="rad-td" id="total_rs_count" title="Total RS Count = Number of Restriction Sites inside Genome File">${totalSiteCount}</td>
//                             <td class="rad-td" id="expected_rs_slice_count" title="Expected RS Slice Count = Total RS Count * Probability">${expectedSiteCount}</td>
//                             <td class="rad-td" id="actual_rs_slice_count" title="Actual RS Slice Count = Slicing based off of probability">${actualSiteCount}</td>
//                         </tr>
//                     </table>
//                 </div>
//             </div>
//             <hr>
//             <div class="row margin-top-md">
//                 <div class="col">
//                     <table class="rad-data-table">
//                         <tr>
//                             <th class="rad-th" title="Fragment Count = Actual RS Slice Count + 1">Fragment Count</th>
//                             <th class="rad-th" title="Fragment Range Count = Actual RS Slice Count in range + 1">Fragment Range Count</th>
//                             <th class="rad-th" title="Fragment Percentage = (Fragments Range Count/Fragment Count) * 100">Fragment Range Percentage</th>
//                         </tr>
//                         <tr>
//                             <td class="rad-td" id="fragment_count" title="Fragment Count = Actual RS Slice Count + 1">${fragmentCount}</td>
//                             <td class="rad-td" id="fragment_range_count" title="Fragment Range Count = Actual RS Slice Count in range + 1">${fragmentRangeCount}</td>
//                             <td class="rad-td" id="fragment_percentage" title="Fragment Range Percentage = (Fragments Range Count/Fragment Count) * 100">${(((fragmentRangeCount)/fragmentCount)*100).toString().match(re)[0]}%</td>
//                         </tr>
//                     </table>
//                 </div>
//             </div>
//             `;


//             /*Generate chart*/
//             if(fragmentChartCanvas !== null){
//             let chartLabels = [];
//             let chartData = [];

//             if(includeOutliers){
//                 if(graphRangeMin > 1){
//                     chartLabels.push(`<${graphRangeMin}`);
//                     chartData.push(`${fragmentSizes[0]}`);
//                 }
//             }
            
//             for(let i = 1; i < fragmentSizes.length-1; i++){
//                 let min = `${graphRangeMin + (i-1)*lengthDistribution}`;
//                 let max = `${(graphRangeMin + i*lengthDistribution-1) > graphRangeMax ? graphRangeMax : graphRangeMin + i*lengthDistribution-1}`;
//                 let range = min === max ? min : `${min}-${max}`;
//                 chartLabels.push(range);
//                 chartData.push(`${fragmentSizes[i]}`);
//             }

//             if(includeOutliers){
//                 chartLabels.push(`${graphRangeMax}<`);
//                 chartData.push(`${fragmentSizes[fragmentSizes.length-1]}`);
//             }
            


//             fragmentChartObject = new Chart(fragmentChartCanvas, {
//                 type: 'bar',
//                 data: {
//                     labels: chartLabels,
//                     datasets: [{
//                         label: 'Fragments',
//                         data: chartData,
//                         backgroundColor: [
//                             'rgba(54, 162, 235, 0.2)',
//                         ],
//                         borderColor: [
//                             'rgba(54, 162, 235, 1)',
//                         ],
//                         borderWidth: 1
//                     }]
//                 },
//                 options: {
//                     scales: {
//                         x: {
//                             title: {
//                                 display: true,
//                                 text: "Fragment Length"
//                             }
//                         },
//                         y: {
//                             beginAtZero: true,
//                             title: {
//                                 display: true,
//                                 text: "Fragment Count"
//                             }
//                         }
//                     }
//                 }
//             });
//             }

//             var date2 = new Date();
//             var elapsedTime = date2-date1;
//             elapsedTime = elapsedTime/1000
//             console.log(`Elapsed time: ${elapsedTime} seconds`);

            
//             //let progress bar catch up
//             await new Promise(resolve => setTimeout(resolve, 500));

//             /* Display the elements hidden in the beginning */
//             for(let i = 0; i < hideThenShow.length; i++){
//                 hideThenShow[i].style.display = displayHistory[i];
//             }

//             /*Hide elements specified at the end*/
//             for(let i = 0; i < showThenHide.length; i++){
//                 showThenHide[i].style.display = "none";
//             }
//         }
//     })(reader);

//     console.log("Reading File");

//     //Read file as text
//     reader.readAsText(genomeFile);
// }


function setInitialValues(config){

    config.probability = Math.floor(config.probability*1000);

    if(config.progressBar){
        config.progressBar.style.width = "0%";
    }

    config.fragmentTableContainer.innerHTML = ``;
    if(fragmentChartObject !== null) {
        console.log("Destroyed");
        fragmentChartObject.destroy();
    }
}


function hideElementsBeginning(config){
    config.hideThenShowDisplayHistory = [];
    for(let i = 0; i < config.hideThenShow.length; i++){
        config.hideThenShowDisplayHistory.push(config.hideThenShow[i].style.display);
        config.hideThenShow[i].style.display = "none"
    }
}


function showElementsEnd(config){
    for(let i = 0; i < config.hideThenShow.length; i++){
        config.hideThenShow[i].style.display = config.hideThenShowDisplayHistory[i];
    }
}

function showElementsBeginning(config){
    for(let i = 0; i < config.showThenHide.elements.length; i++){
        config.showThenHide.elements[i].style.display = config.showThenHide.displays[i];
    }
}


function hideElementsEnd(config){
    for(let i = 0; i < config.showThenHide.elements.length; i++){
        config.showThenHide.elements[i].style.display = "none";
    }
}


/*
We can get the distribution count by dividing (graphRangeMax-graphRangeMin)/lengthDistribution rounded up
For example: (100-1)/ 2 = 2      1-50    51-100
Add 2 to the count for outliers.

If the remainder is 0 we need to add one extra distribution count otherwise we will be missing one.
For example:    (101-1) / 2 = 2. 2 + 1 = 3     1-50  51-100  101-101
*/
function getDistributionCount(rangeMin, rangeMax, config){
    let distributionCount = Math.ceil((rangeMax-rangeMin)/config.lengthDistribution);
    let remainder = (rangeMax-rangeMin)%config.lengthDistribution;
    if(remainder === 0){
        distributionCount += 1
    }

    return distributionCount;
}


/*
We will get the fragment size and determine if it is within our specified min and max range.
If it is within our
*/
function getFragmentSizes2(sliceIndexes, config){
    
    /* Get the amount of distributions according to the minimum range, maximum range, and length distribution*/
    var distributionCount = getDistributionCount(config);

    //fragmentSizes: An array holding the count for each distribution
    var fragmentSizes = Array(distributionCount).fill(0)

    for(let i = 0; i < sliceIndexes.length-1; i++){
        let fragmentSize = sliceIndexes[i+1] - sliceIndexes[i];
        if(fragmentSize >= config.graphRangeMin && fragmentSize <= config.graphRangeMax){
            let index = Math.floor((fragmentSize-config.graphRangeMin)/config.lengthDistribution) + 1
            if(index >= fragmentSizes.length){
                index = fragmentSizes.length-1;
            }

            fragmentSizes[index]++;
        } else if (fragmentSize < config.graphRangeMin){
            fragmentSizes[0]++;
        } else {
            fragmentSizes[fragmentSizes.length-1]++;
        }
    }

    return fragmentSizes;
}


/*
We will get the fragment size and determine if it is within our specified min and max range.
If it is within our
*/
function getFragmentSizes(sliceIndexes){

    //fragmentSizes: An array holding the count for each distribution
    var fragmentSizes = {};
    
    
    for(let i = 0; i < sliceIndexes.length-1; i++){
        let fragmentSize = sliceIndexes[i+1] - sliceIndexes[i];
        fragmentSizes[fragmentSize] = fragmentSizes[fragmentSize] != undefined ? fragmentSizes[fragmentSize]+1 : 1;
    }

    return fragmentSizes;
}


function getFragmentDistributions(fragmentSizes, config){

    /* Get the amount of distributions according to the minimum range, maximum range, and length distribution*/
    var distributionCountBegin = getDistributionCount(config.graphRangeMin, config.focusRangeMin-1, config);
    var distributionCountMiddle = getDistributionCount(config.focusRangeMin, config.focusRangeMax, config);
    var distributionCountEnd = getDistributionCount(config.focusRangeMax+1, config.graphRangeMax, config);
    console.log(`${distributionCountBegin} ${distributionCountMiddle} ${distributionCountEnd}`);


    /*Get graph begin*/
    console.log(`Begin Length ${distributionCountBegin}`);
    var fragmentDistributionsBegin = distributionCountBegin > 0 ? new Array(distributionCountBegin) : [];
    for(let i = 0; i < fragmentDistributionsBegin.length; i++){
        let min = `${config.graphRangeMin + i*config.lengthDistribution}`;
        let max = `${(config.graphRangeMin + (i+1)*config.lengthDistribution-1) > (config.focusRangeMin-1) ? (config.focusRangeMin-1) : config.graphRangeMin + (i+1)*config.lengthDistribution-1}`;
        let range = min === max ? min : `${min}-${max}`;
        fragmentDistributionsBegin[i] = {
            count: 0,
            range,
            focusArea: false,
        };
    }

    console.log(`Middle Length ${distributionCountMiddle}`);
    var fragmentDistributionsMiddle = new Array(distributionCountMiddle);
    for(let i = 0; i < fragmentDistributionsMiddle.length; i++){
        let min = `${config.focusRangeMin + i*config.lengthDistribution}`;
        let max = `${(config.focusRangeMin + (i+1)*config.lengthDistribution-1) > config.focusRangeMax ? config.focusRangeMax : config.focusRangeMin + (i+1)*config.lengthDistribution-1}`;
        let range = min === max ? min : `${min}-${max}`;
        fragmentDistributionsMiddle[i] = {
            count: 0,
            range,
            focusArea: true,
        };
    }

    console.log(`End Length ${distributionCountEnd}`);
    var fragmentDistributionsEnd = distributionCountEnd > 0 ? new Array(distributionCountEnd) : [];
    for(let i = 0; i < fragmentDistributionsEnd.length; i++){
        let min = `${(config.focusRangeMax+1) + i*config.lengthDistribution}`;
        let max = `${((config.focusRangeMax+1) + (i+1)*config.lengthDistribution-1) > config.graphRangeMax ? config.graphRangeMax : (config.focusRangeMax+1) + (i+1)*config.lengthDistribution-1}`;
        let range = min === max ? min : `${min}-${max}`;
        fragmentDistributionsEnd[i] = {
            count: 0,
            range,
            focusArea: false,
        };
    }

    var outliersEnd = [{
        count: 0,
        range: `${config.graphRangeMax}<`,
        focusArea: false,

    },];

    var outliersBegin = [{
        count: 0,
        range: `<${config.graphRangeMin}`,
        focusArea: false,
    },];


    for(let size in fragmentSizes){
        size = parseInt(size);
        if(size >= config.graphRangeMin && size < config.focusRangeMin-1 && fragmentDistributionsBegin.length > 0){
            //console.log(`Fragment distribution length is ${fragmentDistributionsBegin.length}`);
            let index = Math.floor((size-config.graphRangeMin)/config.lengthDistribution);
            fragmentDistributionsBegin[index].count += fragmentSizes[size];
        } else if(size >= config.focusRangeMin && size <= config.focusRangeMax){
            let index = Math.floor((size-config.focusRangeMin)/config.lengthDistribution);
            fragmentDistributionsMiddle[index].count += fragmentSizes[size];
        } else if(size > config.focusRangeMax && size <= config.graphRangeMax && fragmentDistributionsEnd.length > 0){
            let index = Math.floor((size-(config.focusRangeMax+1))/config.lengthDistribution);
            fragmentDistributionsEnd[index].count += fragmentSizes[size];
        } else if (size < config.graphRangeMin){
            outliersBegin[0].count += fragmentSizes[size];
        } else {
            outliersEnd[0].count += fragmentSizes[size];
        }
    }


    var totalDistributions = null;
    if(config.includeOutliers){
        if(config.graphRangeMin !== 1){
            totalDistributions = outliersBegin.concat(fragmentDistributionsBegin, fragmentDistributionsMiddle, fragmentDistributionsEnd, outliersEnd);
        } else {
            totalDistributions = fragmentDistributionsBegin.concat(fragmentDistributionsMiddle, fragmentDistributionsEnd, outliersEnd);
        }
    } else {
        totalDistributions = fragmentDistributionsBegin.concat(fragmentDistributionsMiddle, fragmentDistributionsEnd);
    }


    console.log(totalDistributions[10]);

    return totalDistributions
}


/*
We will get the fragment size and determine if it is within our specified min and max range.
If it is within our
*/
function getFragmentFocusRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists){

    let fragmentFocusRangeCount = 0;
    for(let i = outlierHeadExists ? 1 : 0; i < fragmentDistributions.length - outlierTailExists ? 1 : 0; i++){
        if(fragmentDistributions[i].focusArea){
            fragmentFocusRangeCount += fragmentDistributions[i].count;
        }
    }

    return fragmentFocusRangeCount;
}


function getFragmentGraphRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists){

    let fragmentGraphRangeCount = 0;
    for(let i = outlierHeadExists ? 1 : 0; i < fragmentDistributions.length-outlierTailExists ? 1 : 0; i++){
        fragmentGraphRangeCount += fragmentDistributions[i].count;
    }

    return fragmentGraphRangeCount;
}


function displaySingleEnzymeDigestionData(tableData, config){
    document.querySelector("#after-data-hr") ? document.querySelector("#after-data-hr").remove() : null;

    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
    config.fragmentTableContainer.innerHTML = `

    <nav class="navbar navbar-expand-sm navbar-dark bg-dark rad-navbar-data-tables">
        <a class="navbar-brand rad-navbar-brand-data-tables" href="#">Data Tables</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavData">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse rad-navbar-collapse-data-tables" id="navbarNavData">
            <ul class="navbar-nav">
            <li class="nav-item rad-item active" id="totalityItem">
                <a class="nav-link table-link" href="#" onclick="showTotalityData(this)">Totality</a>
            </li>
            <li class="nav-item rad-item" id="focusRangeItem">
                <a class="nav-link table-link" href="#" onclick="showFocusRangeData(this)">Focus Range</a>
            </li>
            <li class="nav-item rad-item" id="graphRangeItem">
                <a class="nav-link table-link" href="#" onclick="showGraphRangeData(this)">Graph Range</a>
            </li>
            </ul>
        </div>
    </nav>
    <hr>
    <table class="rad-data-table" id="totalityDataTable">
        <tr>
            <th class="rad-th" title="RS Count = Number of Restriction Sites inside Genome File">RS Count</th>
            <th class="rad-th" title="Expected RS Slice Count = RS Count * Probability">Expected RS Slice Count</th>
            <th class="rad-th" title="Actual RS Slice Count = Slicing based off of probability">Actual RS Slice Count</th>
            <th class="rad-th" title="Fragment Count = Actual RS Slice Count + 1">Fragment Count</th>
        </tr>
        <tr>
            <td class="rad-td" id="total_rs_count" title="RS Count = Number of Restriction Sites inside Genome File">${tableData.totalSiteCount}</td>
            <td class="rad-td" id="expected_rs_slice_count" title="Expected RS Slice Count = Total RS Count * Probability">${tableData.expectedSiteCount}</td>
            <td class="rad-td" id="actual_rs_slice_count" title="Actual RS Slice Count = Slicing based off of probability">${tableData.actualSiteCount}</td>
            <td class="rad-td" id="fragment_count" title="Fragment Count = Actual RS Slice Count + 1">${tableData.fragmentCount}</td>
        </tr>
    </table>
    <table class="rad-data-table display-none" id="focusRangeDataTable">
        <tr>
            <th class="rad-th" title="Fragment Count = Actual RS Slice Count in range + 1">Fragment Range Count</th>
            <th class="rad-th" title="Fragment Percentage = (Fragments Range Count/Fragment Count) * 100">Fragment Range Percentage</th>
        </tr>
        <tr>
            <td class="rad-td" id="fragment_range_count" title="Fragment Range Count = Actual RS Slice Count in range + 1">${tableData.fragmentFocusRangeCount}</td>
            <td class="rad-td" id="fragment_percentage" title="Fragment Range Percentage = (Fragments Range Count/Fragment Count) * 100">${(((tableData.fragmentFocusRangeCount)/tableData.fragmentCount)*100).toString().match(re)[0]}%</td>
        </tr>
    </table>
    <table class="rad-data-table display-none" id="graphRangeDataTable">
        <tr>
            <th class="rad-th" title="Fragment Count = Actual RS Slice Count in range + 1">Fragment Range Count</th>
            <th class="rad-th" title="Fragment Percentage = (Fragments Count/Fragment Count) * 100">Fragment Range Percentage</th>
        </tr>
        <tr>
            <td class="rad-td" id="fragment_range_count" title="Fragment Range Count = Actual RS Slice Count in range + 1">${tableData.fragmentGraphRangeCount}</td>
            <td class="rad-td" id="fragment_percentage" title="Fragment Range Percentage = (Fragments Range Count/Fragment Count) * 100">${(((tableData.fragmentGraphRangeCount)/tableData.fragmentCount)*100).toString().match(re)[0]}%</td>
        </tr>
    </table>
    <hr>
    `;
    config.fragmentTableContainer.insertAdjacentHTML("afterend", "<hr id=\"after-data-hr\"");

    $(".nav-link.table-link").on("click", (event)=>{
        console.log("DID IT");
        event.preventDefault();
        return false;
    });
}


function generateChart(fragmentSizes, config){
    if(config.fragmentChartCanvas !== null){
        let chartLabels = [];
        let chartData = [];
        let backgroundColor = [];
        let borderColor = [];

        // if(config.includeOutliers){
        //     if(config.graphRangeMin > 1){
        //         chartLabels.push(`<${config.graphRangeMin}`);
        //         chartData.push(`${fragmentSizes[0]}`);
        //     }
        // }
        
        for(let i = 0; i < fragmentSizes.length; i++){
            // let min = `${config.graphRangeMin + (i-1)*config.lengthDistribution}`;
            // let max = `${(config.graphRangeMin + i*config.lengthDistribution-1) > config.graphRangeMax ? config.graphRangeMax : config.graphRangeMin + i*config.lengthDistribution-1}`;
            // let range = min === max ? min : `${min}-${max}`;
            // chartLabels.push(range);
            // chartData.push(`${fragmentSizes[i]}`);
            chartLabels.push(fragmentSizes[i].range);
            chartData.push(`${fragmentSizes[i].count}`);
            if(fragmentSizes[i].focusArea){
                backgroundColor.push('rgba(30, 130, 76, 0.2)');
                borderColor.push('rgba(30, 130, 76, 1)');
            } else {
                backgroundColor.push('rgba(54, 162, 235, 0.2)');
                borderColor.push('rgba(54, 162, 235, 1.0)');
            }

        }

        // if(config.includeOutliers){
        //     chartLabels.push(`${config.graphRangeMax}<`);
        //     chartData.push(`${fragmentSizes[fragmentSizes.length-1]}`);
        // }
        


        fragmentChartObject = new Chart(config.fragmentChartCanvas, {
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
                            text: "Fragment Length"
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
}


function mergeIndexes(sliceIndexes1, sliceIndexes2, restrictionSite1, restrictionSite2, probability){
    let length1 = restrictionSite1.length;
    let length2 = restrictionSite2.length;
    let sliceOffset1 = Math.floor(restrictionSite1.length/2);
    let sliceOffset2 = Math.floor(restrictionSite2.length/2);
    let mergedIndexes = new Set();
    //if the start of restrictionSite2 or a slice index is in the range [ (sliceIndexOf1 - length2 + 1)-(sliceIndexOf1) ), there is a conflict
    //CTGA
    //ACTG
    //AC TGA

    //ABCTAC TGTAC TGTA

    //AG
    //TA
    //T A GCT

    //TACT
    //ACTG
    //TACTGTACTG
    let conflictCount = 0;
    for(let index of sliceIndexes1){
        let conflict = false;
        let conflictIndex = 0;

        /*
        for(let i = index-1; i > index-length2; i--){
            if(sliceIndexes2.has(i+sliceOffset2)){
                conflict = true;
                conflictIndex = i;
                sliceIndexes2.delete(i+sliceOffset2);
                break;
            } else if(mergedIndexes.has(i)){
                break;
            }
        }
        CCCAC GTACT
        AC TGACTGACTG
        */
        for(let i = index-sliceOffset1+length1-1; i > index-sliceOffset1-length2; i--){
            if(sliceIndexes2.has(i+sliceOffset2)){
                conflict = true;
                conflictIndex = i+sliceOffset2;
                sliceIndexes2.delete(i+sliceOffset2);
                break;
            }
        }
        

        if(conflict){
            conflictCount++;
            let firstChoice = index;
            let secondChoice = conflictIndex;
            let randomNumber = Math.floor((Math.random() * 2) + 1);
            if(randomNumber === 1){
                firstChoice = conflictIndex;
                secondChoice = index;
            }

    
            randomNumber = Math.floor((Math.random() * 1000) + 1);
            if(randomNumber <= probability){
                mergedIndexes.add(firstChoice);
            } else {

                randomNumber = Math.floor((Math.random() * 1000) + 1);
                if(randomNumber <= probability){
                    mergedIndexes.add(secondChoice);
                }
            }

        } else {
            let randomNumber = Math.floor((Math.random() * 1000) + 1);
            if(randomNumber <= probability){
                mergedIndexes.add(index);
            }
        }
    }

    sliceIndexes2.forEach((n)=>{
        let randomNumber = Math.floor((Math.random() * 1000) + 1);
        if(randomNumber <= probability){
            mergedIndexes.add(n);
        }
    });
    console.log(mergedIndexes.size);
    console.log(probability);
    console.log(conflictCount);
    return mergedIndexes;
}



async function singleEnzymeDigest(config){

    console.log("Single digest");
    

    /*Set initial values of certain config elements */
    setInitialValues(config);
    

    /* Show and Hide elements in the beginning specified in config */
    showElementsBeginning(config);
    hideElementsBeginning(config);

    var reader = new FileReader();

    /* run this function on file read */
    console.log("Setting onload");
    reader.onload = (function(reader)
    {
        return async function()
        {
            var timeStart = new Date();

            /*Get file text content, removing all whitespaces, newlines*/
            var contents = reader.result.replace(/>.*[\n]/gm, "").replace(/(\r\n|\n|\r)/gm, "");
            console.log(`The first 10 characters is ${contents.slice(0, 10)}`);

            
            /* 
            sliceIndexes: Contains all of the actual slice indexes
            sliceOffset: If we find the restriction site, we need to add this to the current position for the slice position
            position: Contains the current position inside of the genome file
            totalSiteCount: Contains the total count of restriction sites in the file
            expectedSiteCount: Contains the probability% * total count of restriction sites in the file. For example: 90% * 10 = 9
            actualSiteCount: Contains the randomized slice count which should approximately be the probability% * total count of restriction sites in the file.
            fragmentFocusRangeCount: Contains the amount of fragments in the specified minimum and maximum focus range.
            */
            var sliceIndexes = [0,];
            var sliceOffset = config.restrictionSite1.length/2;
            var position = 0;
            var totalSiteCount = 0;
            var expectedSiteCount = 0;
            var actualSiteCount = 0;
            let lastPercentage = 0;
            /*Get the totalSiteCount, actualSiteCount, and sliceIndexes in this loop */
            while(true){

                //Find position of next site
                position = contents.indexOf(config.restrictionSite1, position);

                /*
                If site is -1, it does not exist in the rest of the file.
                If it is not equal to -1, add 1 to the total site count and run this block of code
                */
                if(position !== -1){
                    totalSiteCount++;

                    /*
                    We will determine if this site was sliced based off randomized probability.
                    If it was add 1 to the actual site count and will add the slice position to sliceIndexes
                    */
                    let randomNumber = Math.floor((Math.random() * 1000) + 1);
                    if(randomNumber <= config.probability){
                        actualSiteCount++;
                        sliceIndexes.push(position+sliceOffset);
                    }

                    //Set the new position to read the file from
                    position += config.restrictionSite1.length;                    
                    


                    //prevent interface from freezing, update progressBar percent
                    let percentage = position/(contents.length);
                    percentage = percentage*100;
                    if(lastPercentage != Math.floor(percentage)){
                        lastPercentage = Math.floor(percentage);
                        if(config.progressBar !== null){
                            config.progressBar.style.width = `${percentage}%`;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1));
                    }
                } else {
                    break;
                }

            }

            sliceIndexes.push(contents.length);


            /* 
            fragmentSizes: Contains the count for each distribution
            fragmentCount: n + 1 where n is the actualSiteCount
            expectedSiteCount: Contains the probability% * total count of restriction sites in the file. For example: 90% * 10 = 9
            fragmentRangeCount: Contains the amount of fragments in the specified minimum and maximum focus range.
            */
            var fragmentSizes = getFragmentSizes(sliceIndexes);
            var fragmentDistributions = getFragmentDistributions(fragmentSizes, config);
            var fragmentCount = actualSiteCount + 1;
            var expectedSiteCount = Math.floor(totalSiteCount * (config.probability/1000));

            var outlierHeadExists = config.includeOutliers && config.graphRange !== 1 ? true : false;
            var outlierTailExists = config.includeOutliers;
            var fragmentFocusRangeCount = getFragmentFocusRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists);
            var fragmentGraphRangeCount = getFragmentGraphRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists);



            /* Display data tables */
            var tableData = {
                totalSiteCount,
                expectedSiteCount,
                actualSiteCount,
                fragmentCount,
                fragmentFocusRangeCount,
                fragmentGraphRangeCount
            };

            displaySingleEnzymeDigestionData(tableData, config)

            /*Generate chart*/
            generateChart(fragmentDistributions, config);

            var timeFinish = new Date();
            var elapsedTime = timeFinish-timeStart;
            elapsedTime = elapsedTime/1000
            console.log(`Elapsed time: ${elapsedTime} seconds`);

            /* Show and hide elements at the end specified in config */
            showElementsEnd(config);
            hideElementsEnd(config);

        }
    })(reader);

    console.log("Reading File");

    //Read file as text
    reader.readAsText(config.genomeFile);
}


async function doubleEnzymeDigest(config){
    console.log("Double digest");
    

    /*Set initial values of certain config elements */
    setInitialValues(config);
    

    /* Show and Hide elements in the beginning specified in config */
    showElementsBeginning(config);
    hideElementsBeginning(config);

    var reader = new FileReader();

    /* run this function on file read */
    console.log("Setting onload");
    reader.onload = (function(reader)
    {
        return async function()
        {
            var timeStart = new Date();

            /*Get file text content, removing all whitespaces, newlines*/
            var contents = reader.result.replace(/>.*[\n]/gm, "").replace(/(\r\n|\n|\r)/gm, "");
            console.log(`The first 10 characters is ${contents.slice(0, 10)}`);


            /*First Enzyme Operation*/
            let sliceIndexes1 = new Set();

            /* 
            sliceOffset: If we find the restriction site, we need to add this to the current position for the slice position
            position: Contains the current position inside of the genome file
            */
            var sliceOffset = config.restrictionSite1.length/2;
            var position = 0;
            let lastPercentage = 0;
            var totalSiteCount = 0;
            /*Get the totalSiteCount, actualSiteCount, and sliceIndexes in this loop */
            while(true){

                //Find position of next site
                position = contents.indexOf(config.restrictionSite1, position);

                /*
                If site is -1, it does not exist in the rest of the file.
                If it is not equal to -1, add 1 to the total site count and run this block of code
                */
                if(position !== -1){
                    sliceIndexes1.add(position+sliceOffset);
                    totalSiteCount++;

                    //Set the new position to read the file from
                    position += config.restrictionSite1.length;                    
                    


                    //prevent interface from freezing, update progressBar percent
                    let percentage = position/(contents.length);
                    percentage = (percentage*100)/2;
                    if(lastPercentage != Math.floor(percentage)){
                        lastPercentage = Math.floor(percentage);
                        if(config.progressBar !== null){
                            config.progressBar.style.width = `${percentage}%`;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1));
                    }
                } else {
                    break;
                }

            }


            /*2nd Enzyme Operation*/
            let sliceIndexes2 = new Set();
                
            /* 
            sliceOffset: If we find the restriction site, we need to add this to the current position for the slice position
            position: Contains the current position inside of the genome file
            */
            sliceOffset = config.restrictionSite2.length/2;
            position = 0;

            /*Get the totalSiteCount, actualSiteCount, and sliceIndexes in this loop */
            while(true){

                //Find position of next site
                position = contents.indexOf(config.restrictionSite2, position);

                /*
                If site is -1, it does not exist in the rest of the file.
                If it is not equal to -1, add 1 to the total site count and run this block of code
                */
                if(position !== -1){
                    totalSiteCount++;

                    sliceIndexes2.add(position+sliceOffset);

                    //Set the new position to read the file from
                    position += config.restrictionSite2.length;                    
                    


                    //prevent interface from freezing, update progressBar percent
                    let percentage = position/contents.length;
                    percentage = ((percentage*100)/2) + 50;
                    if(lastPercentage != Math.floor(percentage)){
                        lastPercentage = Math.floor(percentage);
                        if(config.progressBar !== null){
                            config.progressBar.style.width = `${percentage}%`;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1));
                    }
                } else {
                    break;
                }

            }




        /*Merge indexes based off conflicts and probability*/
        let mergedIndexes = mergeIndexes(sliceIndexes1, sliceIndexes2, config.restrictionSite1, config.restrictionSite2, config.probability);
        mergedIndexes.add(0);
        mergedIndexes.add(contents.length);
        mergedIndexes = Array.from(mergedIndexes);
        mergedIndexes.sort(function(a, b){return a-b});

        /* 
        fragmentSizes: Contains the count for each distribution
        fragmentCount: n + 1 where n is the actualSiteCount
        expectedSiteCount: Contains the probability% * total count of restriction sites in the file. For example: 90% * 10 = 9
        fragmentFocusRangeCount: Contains the amount of fragments in the specified minimum and maximum focus range.
        */
        var actualSiteCount = mergedIndexes.length -2;
        var fragmentSizes = getFragmentSizes(mergedIndexes);
        var fragmentDistributions = getFragmentDistributions(fragmentSizes, config);
        var fragmentCount = actualSiteCount + 1;
        var expectedSiteCount = Math.floor(totalSiteCount * (config.probability/1000));

        var outlierHeadExists = config.includeOutliers && config.graphRange !== 1 ? true : false;
        var outlierTailExists = config.includeOutliers;
        var fragmentFocusRangeCount = getFragmentFocusRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists);
        var fragmentGraphRangeCount = getFragmentGraphRangeCount(fragmentDistributions, outlierHeadExists, outlierTailExists);

        


            /* Display data tables */
            var tableData = {
                totalSiteCount,
                expectedSiteCount,
                actualSiteCount,
                fragmentCount,
                fragmentFocusRangeCount,
                fragmentGraphRangeCount
            };

            displaySingleEnzymeDigestionData(tableData, config)


            /*Generate chart*/
            generateChart(fragmentDistributions, config);

            var timeFinish = new Date();
            var elapsedTime = timeFinish-timeStart;
            elapsedTime = elapsedTime/1000
            console.log(`Elapsed time: ${elapsedTime} seconds`);

            /* Show and hide elements at the end specified in config */
            showElementsEnd(config);
            hideElementsEnd(config);

        }
    })(reader);

    console.log("Reading File");

    //Read file as text
    reader.readAsText(config.genomeFile);
}