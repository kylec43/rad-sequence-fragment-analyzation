import { getAuth, signInWithCustomToken} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


window.FirebaseController = {

    signIn : async function(token){
        await signInWithCustomToken(getAuth(), `${token}`).then((userCredential) => {
            // Signed in
            console.log("Sign in success!");
            // ...
        })
        .catch((e) => {
            console.log(`Sign in fail! ${e}`);
            // ...
        });    
    },


    uploadRestrictionEnzyme: async function(name, restrictionSite){

        var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
        var docSnap = await getDoc(docRef);
        
        if(docSnap.exists()){
            let data = docSnap.data();
            data["restriction_enzymes"].push({'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`});
            await setDoc(docRef, data);
        } else {
            await setDoc(docRef, {'restriction_enzymes': [{'name': name, 'restrictionSite': restrictionSite, 'id': `${Date.now()}${name}${restrictionSite}`}]});
        }
    },

    updateRestrictionEnzyme: async function (){

        try{
    
            console.log("updating firestore");
            var docRef = doc(getFirestore(), 'restriction_enzymes', DOC_NAME)
            
            restriction_enzymes[enzymeSelect.selectedIndex].name = enzymeName.value
            restriction_enzymes[enzymeSelect.selectedIndex].restrictionSite = enzymeSite.value
    
            await setDoc(docRef, {restriction_enzymes});
            document.getElementById(restriction_enzymes[enzymeSelect.selectedIndex]['id']).innerHTML = enzymeName.value;
    
            console.log("file updated")
            
        } catch(e){
            console.log(`update failed: ${e}`);
        }
    }
}