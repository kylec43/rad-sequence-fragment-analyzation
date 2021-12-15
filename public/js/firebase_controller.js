import { getAuth, signInWithCustomToken, signOut, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.1.1/firebase-auth.js";
import {getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";


window.initLogin = ()=>{
    $("#login_form").on("submit", (event)=>{
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        console.log(`${email}, ${password}`);
        console.log("1");
        signInWithEmailAndPassword(getAuth(), email, password).then(({user})=>{
            console.log("2");
            return user.getIdToken().then((idToken)=>{
                console.log("3");
                let res = fetch("/sessionLogin", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
                    },
                    body: JSON.stringify({idToken}),
                });
                console.log(res);
                return res;
            });
        }).then(async ()=>{
            console.log("4");
            return signOut(getAuth());
        }).then(()=>{
            console.log("5");
            window.location.assign("/")
        }).catch((e)=>{
            $("#error").html("Invalid Username or Password");
        });
    });
}

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