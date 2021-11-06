window.radAnalyze = async function(genomeFile, restrictionSite, probability){


    await new Promise(resolve => setTimeout(resolve, 3000));

    var probabilityDecimal = parseFloat(probability)
    var fragmentCount = 0;
    probability = probabilityDecimal * 100;
    probability = Math.floor(probability);

    console.log(`File size is: ${genomeFile.size} bytes`);
    console.log(`Restriction Site is: ${restrictionSite}`);
    console.log(`Probability is: ${probability}`)
    console.log("Initializing File Reader")

    var reader = new FileReader();

    console.log("Settings onload");
    reader.onload = (function(reader)
    {
        return function()
        {
            console.log("Reading contents...")
            var contents = reader.result;
            console.log(`Result size is ${contents.length}`);

            console.log(`Finding Restriction Site Count: ${restrictionSite}`)
            var position = 0;
            var totalSiteCount = 0;
            var expectedSiteCount = 0;
            var actualSiteCount = 0;
            console.log(`Position is ${position}, Contents length is ${contents.length}`);
            while(position !== -1 && position < contents.length){
                //console.log("Attempted");
                position = contents.indexOf(restrictionSite, position);
                //console.log(`New postiion is: ${position}`);
                if(position !== -1){
                    totalSiteCount++;
                    let randomNumber = Math.floor((Math.random() * 100) + 1);
                    if(randomNumber <= probability){
                        actualSiteCount++;
                    }

                    position += restrictionSite.length;
                }
            }

            fragmentCount = totalSiteCount + 1;
            expectedSiteCount = Math.floor(totalSiteCount * probabilityDecimal)
            console.log(`The Fragment count was: ${fragmentCount}`);
            console.log(`The Total restriction site count is: ${totalSiteCount}`);
            console.log(`The Expected restriction site count was: ${expectedSiteCount}`);
            console.log(`The Actual restriction site count was: ${actualSiteCount}`);

        }
    })(reader);

    console.log("Reading File");
    reader.readAsText(genomeFile);
}