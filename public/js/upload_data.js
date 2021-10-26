import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-storage.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

window.uploadSelection = async function uploadSelection(){

    error.style.display = "none";
    error.innerHTML = "";


    console.log("BEGIN");

    if(selectType.value == "Genome"){
        await uploadGenome(selectionName.value, genomeFile);
    } else {
        await uploadRestrictionEnzyme(selectionName.value, rsInput.value);
    }
}

window.uploadGenome = async function uploadGenome(name, genomeToUpload){

    console.log("start");
    uploadButton.style.display = "none";
    console.log(`display is ${uploadButton.style.display}`);
    uploadProgressDiv.style.display = "flex";
    uploadingDiv.style.display = "flex";

    try{

        //Get genomeFile text
        console.log("getting file name")
        console.log("get reference in storage");
        const fileName = Date.now();
        const fileRef = await ref(getStorage(), `${GENOME_FOLDER}/${fileName}`);
        
        console.log("uploading file")
        let uploadTask = uploadBytesResumable(fileRef, genomeToUpload);

        console.log(` 1 display is ${uploadButton.style.display}`);

        uploadTask.on('state_changed', (snapshot) =>  {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Progress: ${progress}`);
            progressBar.style.width = `${progress}%`;
            console.log(` 2 display is ${uploadButton.style.display}`);

            }, (e) => {
                console.log("error1");
                throw e;
            }, 
            async () => {

                try{
                    console.log("getting download url");
                    let downloadUrl;
                    await getDownloadURL(fileRef).then((url)=>{
                        downloadUrl = url;
                    });

                    console.log("uploading to firestore");
                    var docRef = doc(getFirestore(), 'genomes', DOC_NAME)
                    var docSnap = await getDoc(docRef);
                    
                    if(docSnap.exists()){
                        let data = docSnap.data();
                        data["genomes"].push({'name': name, 'fileName': fileName, 'downloadURL': downloadUrl});
                        await setDoc(doc(getFirestore(), 'genomes', DOC_NAME), data);
                    } else {
                        await setDoc(doc(getFirestore(), 'genomes', DOC_NAME), {'genomes': [{'name': name, 'fileName': fileName, 'downloadURL': downloadUrl}]});
                    }

                    console.log("file uploaded")
                    console.log("done");
                    uploadButton.style.display = "inline-block";
                    uploadProgressDiv.style.display = "none";
                    uploadingDiv.style.display = "none";

                } catch(e){
                    console.log(`error2: ${e}`);
                    throw e;
                }
            }
        );

    } catch(e){
        console.log(`upload failed: ${e}`);
        error.style.display = "block";
        error.innerHTML = `${e}`;
        uploadButton.style.display = "inline-block";
        uploadProgressDiv.style.display = "none";
        uploadingDiv.style.display = "none";
    }



}

window.uploadRestrictionEnzyme = async function uploadRestrictionEnzyme(name, restrictionSite){

    try{

        uploadButton.style.display = "none";
        uploadingDiv.style.display = "flex";

        console.log("uploading to firestore");
        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        var docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();
            data["restriction_enzymes"].push({'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`});
            await setDoc(doc(getFirestore(), 'restriction_enzymes', DOC_NAME), data);
        } else {
            await setDoc(doc(getFirestore(), 'restriction_enzymes', DOC_NAME), {'restriction_enzymes': [{'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`}]});
        }

        console.log("file uploaded")

        
    } catch(e){
        console.log('upload failed');
        error.style.display = "block";
        error.innerHTML = `${e}`;
    }

    console.log("done");
    uploadButton.style.display = "inline-block";
    uploadingDiv.style.display = "none";


}

window.genomeFile = null;
genomeFileInput.addEventListener('change', e => {
    console.log('selected!');
    window.genomeFile = e.target.files[0];
    console.log('file upload', e.target.files[0]);
});

