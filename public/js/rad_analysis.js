window.radAnalyze = async function(genomeFile, restrictionSite, probability, progressBar = null, hideElementsBeginning = [], hideElementsEnd = []){

    /* Hide these elements in the beginning, store their display history for the end */
    var displayHistory = [];
    for(let i = 0; i < hideElementsBeginning.length; i++){
        displayHistory.push(hideElementsBeginning[i].style.display);
        hideElementsBeginning[i].style.display = "none"
    }

    /* Get the probability as a decimal float, convert the probability to an integer percentage as well*/
    var probabilityDecimal = parseFloat(probability)
    probability = probabilityDecimal * 100;
    probability = Math.floor(probability);

    console.log(`File size is: ${genomeFile.size} bytes`);
    console.log(`Restriction Site is: ${restrictionSite}`);
    console.log(`Probability is: ${probability}`)
    console.log("Initializing File Reader")

    var reader = new FileReader();
    var fragmentCount = 0;

    /* run this function on file read */
    console.log("Setting onload");
    reader.onload = (function(reader)
    {
        return async function()
        {
            /*Get file text content */
            console.log("Reading contents...")
            var contents = reader.result;
            console.log(`Result size is ${contents.length}`);

            console.log(`Finding Restriction Site Count: ${restrictionSite}`)
            var position = 0;
            var totalSiteCount = 0;
            var expectedSiteCount = 0;
            var actualSiteCount = 0;
            console.log(`Position is ${position}, Contents length is ${contents.length}`);
            var lastPercentage = 0;

            /*Get the totalSiteCount and actualSiteCount in this loop */
            while(position !== -1 && position < contents.length){

                //Find position of next site
                position = contents.indexOf(restrictionSite, position);

                //If site is -1, it does not exist in the rest of the file, 
                //Otherwise add to the totalSiteCount and actualSiteCount here
                if(position !== -1){
                    totalSiteCount++;

                    //Determine if this site was sliced based off of probability
                    let randomNumber = Math.floor((Math.random() * 100) + 1);
                    if(randomNumber <= probability){
                        actualSiteCount++;
                    }

                    //Set the new position to read the file from
                    position += restrictionSite.length;                    
                    
                    //Update the progress bar
                    if(progressBar !== null){
                        var percentage = position/(contents.length)
                        percentage = percentage*100;
                        percentage = Math.floor(percentage);
                        if(lastPercentage !== percentage){
                            lastPercentage = percentage;
                            progressBar.style.width = `${percentage}%`;
                        }
                    }
                }
            }

            //Fragment count will be n + 1 where n is the actualSiteCount
            fragmentCount = actualSiteCount + 1;

            //expectedSiteCount will be totalSiteCount * probability decimal rounded down. I.E. e.g. 10 * 0.95 = 9 expected sites
            expectedSiteCount = Math.floor(totalSiteCount * probabilityDecimal)

            /*Print results to console*/
            console.log(`The Total restriction site count was: ${totalSiteCount}`);
            console.log(`The Expected restriction site count was: ${expectedSiteCount}`);
            console.log(`The Actual restriction site count was: ${actualSiteCount}`);
            console.log(`The Fragment count was: ${fragmentCount}`);
            console.log("Finish");

            await new Promise(resolve => setTimeout(resolve, 1500));

            /* Display the elements hidden in the beginning */
            for(let i = 0; i < hideElementsBeginning.length; i++){
                hideElementsBeginning[i].style.display = displayHistory[i];
            }

            /*Hide elements specified at the end*/
            for(let i = 0; i < hideElementsEnd.length; i++){
                hideElementsEnd[i].style.display = "none";
            }
        }
    })(reader);

    console.log("Reading File");

    //Read file as text
    reader.readAsText(genomeFile);
}