//Analysis is done here.

/* Chart Object */
var fragmentChartObject = null;

window.radAnalyze = async function(config){

    if(config.restrictionSite2 !== ""){
        doubleEnzymeDigest(config);
    } else {
        singleEnzymeDigest(config);
    }


}



// async function singleEnzymeDigest(config){

//     console.log("Single digest");
    
//     /* Get from config*/
//     let genomeFile = config.genomeFile;
//     let restrictionSite = config.restrictionSite;
//     let probability = Math.floor(config.probability*100);
//     let lengthDistribution = config.lengthDistribution;
//     let rangeMin = config.rangeMin;
//     let rangeMax = config.rangeMax;
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
//             let distributionCount = Math.ceil((rangeMax-rangeMin)/lengthDistribution) + 2
//             let remainder = (rangeMax-rangeMin)%lengthDistribution;
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

//                         if(fragmentSize >= rangeMin && fragmentSize <= rangeMax){
//                             let index = Math.floor((fragmentSize-rangeMin)/lengthDistribution) + 1
//                             if(index >= fragmentSizes.length){
//                                 index = fragmentSizes.length-1;
//                             }

//                             fragmentSizes[index]++;
//                             fragmentRangeCount++;
//                         } else if (fragmentSize < rangeMin){
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
//             if(fragmentSize >= rangeMin && fragmentSize <= rangeMax){
//                 let index = Math.floor((fragmentSize-rangeMin)/lengthDistribution) + 1
//                 if(index >= fragmentSizes.length){
//                     index = fragmentSizes.length-1;
//                 }
//                 console.log(`Index is ${index}`);
//                 fragmentSizes[index]++;
//                 fragmentRangeCount++;
//             } else if (fragmentSize < rangeMin){
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
//                 if(rangeMin > 1){
//                     chartLabels.push(`<${rangeMin}`);
//                     chartData.push(`${fragmentSizes[0]}`);
//                 }
//             }
            
//             for(let i = 1; i < fragmentSizes.length-1; i++){
//                 let min = `${rangeMin + (i-1)*lengthDistribution}`;
//                 let max = `${(rangeMin + i*lengthDistribution-1) > rangeMax ? rangeMax : rangeMin + i*lengthDistribution-1}`;
//                 let range = min === max ? min : `${min}-${max}`;
//                 chartLabels.push(range);
//                 chartData.push(`${fragmentSizes[i]}`);
//             }

//             if(includeOutliers){
//                 chartLabels.push(`${rangeMax}<`);
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

    config.probability = Math.floor(config.probability*100);

    if(config.progressBar){
        config.progressBar.style.width = "0%";
    }

    config.fragmentTableContainer.innerHTML = ``;
    if(fragmentChartObject !== null) {
        console.log("Destroyed");
        fragmentChartObject.destroy();
    }
}


async function singleEnzymeDigest(config){

    console.log("Single digest");
    

    /*Set initial values of certain config elements */

    setInitialValues(config);
    

    /* Hide these elements in the beginning, store their display history for the end */
    var displayHistory = [];
    for(let i = 0; i < config.hideThenShow.length; i++){
        displayHistory.push(config.hideThenShow[i].style.display);
        config.hideThenShow[i].style.display = "none"
    }

    console.log(`File size is: ${config.genomeFile.size} bytes`);
    console.log(`Restriction Site is: ${config.restrictionSite}`);
    console.log(`Probability is: ${config.probability}`)
    console.log("Initializing File Reader")

    var reader = new FileReader();
    var fragmentCount = 0;

    /* run this function on file read */
    console.log("Setting onload");
    reader.onload = (function(reader)
    {
        return async function()
        {
            var date1 = new Date();

            /*Get file text content */
            console.log("Reading contents...")
            var contents = reader.result.replace(/(\r\n|\n|\r)/gm, "");
            console.log(`Result size is ${contents.length}`);

            console.log(`Finding Restriction Site Count: ${config.restrictionSite}`)
            var position = 0;
            var totalSiteCount = 0;
            var expectedSiteCount = 0;
            var actualSiteCount = 0;
            var fragmentRangeCount = 0;
            console.log(`Position is ${position}, Contents length is ${contents.length}`);
            var lastPercentage = 0;

            
            /* Get the amount of distributions */
            let distributionCount = Math.ceil((config.rangeMax-config.rangeMin)/config.lengthDistribution) + 2
            let remainder = (config.rangeMax-config.rangeMin)%config.lengthDistribution;
            if(remainder === 0){
                distributionCount += 1
            }

            /* Create an array to put the amount of fragments for each distribution */
            var fragmentSizes = Array(distributionCount).fill(0)
            var lastSliceIndex = 0;
            var sliceOffset = config.restrictionSite.length/2;

            /*Get the totalSiteCount, actualSiteCount, and fragment sizes in this loop */
            while(position !== -1 && position < contents.length){

                //Find position of next site
                position = contents.indexOf(config.restrictionSite, position);

                //If site is -1, it does not exist in the rest of the file, 
                //Otherwise add to the totalSiteCount and actualSiteCount here
                if(position !== -1){
                    totalSiteCount++;

                    //Determine if this site was sliced based off of probability
                    let randomNumber = Math.floor((Math.random() * 100) + 1);
                    if(randomNumber <= config.probability){
                        actualSiteCount++;

                        let fragmentSize = position+sliceOffset - lastSliceIndex;

                        if(fragmentSize >= config.rangeMin && fragmentSize <= config.rangeMax){
                            let index = Math.floor((fragmentSize-config.rangeMin)/config.lengthDistribution) + 1
                            if(index >= fragmentSizes.length){
                                index = fragmentSizes.length-1;
                            }

                            fragmentSizes[index]++;
                            fragmentRangeCount++;
                        } else if (fragmentSize < config.rangeMin){
                            fragmentSizes[0]++;
                        } else {
                            fragmentSizes[fragmentSizes.length-1]++;
                        }

                        lastSliceIndex = position+sliceOffset;
                    }

                    //Set the new position to read the file from
                    position += config.restrictionSite.length;                    
                    
                    //Update the progress bar
                    if(config.progressBar !== null){
                        var percentage = position/(contents.length)
                        percentage = percentage*100;
                        percentage = Math.floor(percentage);
                        if(lastPercentage !== percentage){
                            lastPercentage = percentage;
                            config.progressBar.style.width = `${percentage}%`;
                        }
                    }
                }
            }

            /* Add last fragment */
            let fragmentSize = contents.length - lastSliceIndex;
            if(fragmentSize >= config.rangeMin && fragmentSize <= config.rangeMax){
                let index = Math.floor((fragmentSize-config.rangeMin)/config.lengthDistribution) + 1
                if(index >= fragmentSizes.length){
                    index = fragmentSizes.length-1;
                }
                console.log(`Index is ${index}`);
                fragmentSizes[index]++;
                fragmentRangeCount++;
            } else if (fragmentSize < config.rangeMin){
                fragmentSizes[0]++;
            } else {
                fragmentSizes[fragmentSizes.length-1]++;
            }


            /* Get fragment count and expected site count */

            //Fragment count will be n + 1 where n is the actualSiteCount
            fragmentCount = actualSiteCount + 1;

            //expectedSiteCount will be totalSiteCount * probability decimal rounded down. I.E. e.g. 10 * 0.95 = 9 expected sites
            expectedSiteCount = Math.floor(totalSiteCount * (config.probability/100))


            /* Display data tables */
            var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (2 || -1) + '})?');
            config.fragmentTableContainer.innerHTML = `
            <div class="row">
                <div class="col">
                    <table class="rad-data-table">
                        <tr>
                            <th class="rad-th" title="Total RS Count = Number of Restriction Sites inside Genome File">Total RS Count</th>
                            <th class="rad-th" title="Expected RS Slice Count = Total RS Count * Probability">Expected RS Slice Count</th>
                            <th class="rad-th" title="Actual RS Slice Count = Slicing based off of probability">Actual RS Slice Count</th>
                        </tr>
                        <tr>
                            <td class="rad-td" id="total_rs_count" title="Total RS Count = Number of Restriction Sites inside Genome File">${totalSiteCount}</td>
                            <td class="rad-td" id="expected_rs_slice_count" title="Expected RS Slice Count = Total RS Count * Probability">${expectedSiteCount}</td>
                            <td class="rad-td" id="actual_rs_slice_count" title="Actual RS Slice Count = Slicing based off of probability">${actualSiteCount}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <hr>
            <div class="row margin-top-md">
                <div class="col">
                    <table class="rad-data-table">
                        <tr>
                            <th class="rad-th" title="Fragment Count = Actual RS Slice Count + 1">Fragment Count</th>
                            <th class="rad-th" title="Fragment Range Count = Actual RS Slice Count in range + 1">Fragment Range Count</th>
                            <th class="rad-th" title="Fragment Percentage = (Fragments Range Count/Fragment Count) * 100">Fragment Range Percentage</th>
                        </tr>
                        <tr>
                            <td class="rad-td" id="fragment_count" title="Fragment Count = Actual RS Slice Count + 1">${fragmentCount}</td>
                            <td class="rad-td" id="fragment_range_count" title="Fragment Range Count = Actual RS Slice Count in range + 1">${fragmentRangeCount}</td>
                            <td class="rad-td" id="fragment_percentage" title="Fragment Range Percentage = (Fragments Range Count/Fragment Count) * 100">${(((fragmentRangeCount)/fragmentCount)*100).toString().match(re)[0]}%</td>
                        </tr>
                    </table>
                </div>
            </div>
            `;


            /*Generate chart*/
            if(config.fragmentChartCanvas !== null){
            let chartLabels = [];
            let chartData = [];

            if(config.includeOutliers){
                if(config.rangeMin > 1){
                    chartLabels.push(`<${config.rangeMin}`);
                    chartData.push(`${fragmentSizes[0]}`);
                }
            }
            
            for(let i = 1; i < fragmentSizes.length-1; i++){
                let min = `${config.rangeMin + (i-1)*config.lengthDistribution}`;
                let max = `${(config.rangeMin + i*config.lengthDistribution-1) > config.rangeMax ? config.rangeMax : config.rangeMin + i*config.lengthDistribution-1}`;
                let range = min === max ? min : `${min}-${max}`;
                chartLabels.push(range);
                chartData.push(`${fragmentSizes[i]}`);
            }

            if(config.includeOutliers){
                chartLabels.push(`${config.rangeMax}<`);
                chartData.push(`${fragmentSizes[fragmentSizes.length-1]}`);
            }
            


            fragmentChartObject = new Chart(config.fragmentChartCanvas, {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [{
                        label: 'Fragments',
                        data: chartData,
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                        ],
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

            var date2 = new Date();
            var elapsedTime = date2-date1;
            elapsedTime = elapsedTime/1000
            console.log(`Elapsed time: ${elapsedTime} seconds`);

            
            //let progress bar catch up
            await new Promise(resolve => setTimeout(resolve, 500));

            /* Display the elements hidden in the beginning */
            for(let i = 0; i < config.hideThenShow.length; i++){
                config.hideThenShow[i].style.display = displayHistory[i];
            }

            /*Hide elements specified at the end*/
            for(let i = 0; i < config.showThenHide.length; i++){
                config.showThenHide[i].style.display = "none";
            }
        }
    })(reader);

    console.log("Reading File");

    //Read file as text
    reader.readAsText(config.genomeFile);
}


async function doubleEnzymeDigest(){
    console.log("double digest");
}