/*This function will fragment the genome into slices*/
function FragmentGenome(genome, enzyme, probability){

    let fragments = [];     //Contains the Genome Fragments
    let sliceMarkers = [];  //Contains the slice locations

    //Mark slice locations, add to sliceMarkers


    //perform slices, add to fragments



    return fragments;
}


/*Main function responsible for getting analyzation results*/
function RadSeqAnalyzation(genome, enzyme, probability){



    //Perform Slicing, Get Fragments
    let fragments = FragmentGenome(genome, enzyme, probability);

    /*???? what will we analyze after we get the fragments ????*/
    let results = fragments;

    //Return Results
    return JSON.stringify(results);
}

module.exports = {RadSeqAnalyzation,};