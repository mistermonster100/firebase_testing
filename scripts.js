
// Import Firebase SDK
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

    // 🔹 Replace with your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyDjSRPgwoeNdSnRleq85mS_mqmV9Tdrkzs",
      authDomain: "tiger-tutors.firebaseapp.com",
      projectId: "tiger-tutors",
      storageBucket: "tiger-tutors.firebasestorage.app",
      messagingSenderId: "343214157028",
      appId: "1:343214157028:web:9bf5d0453068e95ddf90f1",
      measurementId: "G-3ZMT5ERRFR"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let localData = {}; // 🔹 Stores fetched data locally

        async function fetchFirestoreData() {
            let dataObject = {}; // Temporary storage for fetched data

            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                dataObject[doc.id] = doc.data(); // Store each document by its ID
            });

            localData = dataObject; // Save data locally
            displayData(); // ✅ Call display function separately
        }

        function displayData() {
                    const dataList = document.getElementById("data-list");
                    dataList.innerHTML = ""; // ✅ Clear list before displaying

                    for (const [key, value] of Object.entries(localData)) {
                        const li = document.createElement("li");
                        li.innerHTML = `
                            <strong>ID:</strong> ${key} <br>
                            <strong>Name:</strong> ${value.name} <br>
                            <strong>Email:</strong> ${value.email} <br>
                            <strong>Phone:</strong> ${value.phone} <br>
                            <strong>Competency Level:</strong> ${value.competency} <br>
                            <hr>
                        `;
                        dataList.appendChild(li);
                    }
        }

    function saveDataLocally(docId, name, email, phone, competency) {
            localData[docId] = { name, email, phone, competency }; // ✅ Update local JSON object
            displayData(); // ✅ Update UI immediately
    }

    async function uploadData(docId, name, email, phone, competency) {
                try {
                    await setDoc(doc(db, "users", docId), { name, email, phone, competency });
                    console.log("Data uploaded to Firestore successfully!");
                } catch (error) {
                    console.error("Error uploading document: ", error);
                }
    }

    function addData() {
                const docId = document.getElementById("doc-id").value.trim();
                const name = document.getElementById("name").value.trim();
                const email = document.getElementById("email").value.trim();
                const phone = document.getElementById("phone").value.trim();
                const competency = document.getElementById("competency").value.trim();

                if (!docId || !name || !email || !phone || !competency) {
                    alert("Please enter valid details. Competency must be between 0-9.");
                    return;
                }

                saveDataLocally(docId, name, email, phone, competency); // ✅ Update local data first
                uploadData(docId, name, email, phone, competency); // ✅ Upload in the background
            }


    Object.assign(window, {addData});


    fetchFirestoreData();
