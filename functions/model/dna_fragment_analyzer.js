const { sendPasswordResetEmail } = require("@firebase/auth");

class DnaFragmentAnalyzer{



    analyze(genome, enzyme, sliceProbability=1.0){

        //Perform Slicing, Get Fragments
        let fragments = FragmentDNA(genome, enzyme, probability);

        /*???? what will we analyze after we get the fragments ????*/
        let results = fragments;
        
        return results;
    }
    
    /*This function will fragment the DNA into slices*/
    fragmentDNA(genome, enzyme, sliceProbability){

        let fragments = [];     //Contains the Genome Fragments
        let sliceMarkers = [];  //Contains the slice locations

        //Mark slice locations, add to sliceMarkers


        //perform slices, add to fragments



        return fragments;
    }


    /*Main function responsible for getting analyzation results*/
    radSeqAnalyzation(genome, enzyme, probability){

}

}

module.exports = DnaFragmentAnalyzer