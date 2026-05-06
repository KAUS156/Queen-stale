// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// // Firebase Configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyDKVwHm3-RO3IkycB8VdwizUYQLgasGqzk",
//     authDomain: "lucky-triode-450317-g7.firebaseapp.com",
//     projectId: "lucky-triode-450317-g7",
//     storageBucket: "lucky-triode-450317-g7.firebasestorage.app",
//     messagingSenderId: "778199870672",
//     appId: "1:778199870672:web:62a9891e41b3a3d3f242d5"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // ================= REGISTER FUNCTION =================
// window.register = async function() {
//     const name = document.getElementById("name").value;
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;
//     const area = document.getElementById("area").value;

//     // Validation
//     if (!name || !email || !password || !area) {
//         alert("Please fill all fields!");
//         return;
//     }

//     if (email === "mailak@gmail.com") {
//         alert("This email is reserved for admin!");
//         return;
//     }

//     if (password.length < 6) {
//         alert("Password must be at least 6 characters!");
//         return;
//     }

//     try {
//         // Create user in Firebase Auth
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;

//         // Store user data in Firestore
//         await addDoc(collection(db, "users"), {
//             uid: user.uid,
//             name: name,
//             email: email,
//             area: area,
//             isAdmin: false,
//             createdAt: new Date().toISOString()
//         });

//         alert("Registration Successful! Please login.");
//         window.location.href = "login.html";
//     } catch (error) {
//         console.error("Registration Error:", error);
        
//         if (error.code === 'auth/email-already-in-use') {
//             alert("Email already registered! Please login.");
//         } else if (error.code === 'auth/weak-password') {
//             alert("Password is too weak! Use at least 6 characters.");
//         } else if (error.code === 'auth/invalid-email') {
//             alert("Invalid email format!");
//         } else {
//             alert("Registration failed: " + error.message);
//         }
//     }
// };

// // ================= LOGIN FUNCTION =================
// window.login = async function() {
//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     if (!email || !password) {
//         alert("Please enter email and password!");
//         return;
//     }

//     try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
        
//         // Check if admin
//         let isAdmin = false;
        
//         if (email === "mailak@gmail.com") {
//             isAdmin = true;
//         } else {
//             const userQuery = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
//             if (!userQuery.empty) {
//                 const userData = userQuery.docs[0].data();
//                 isAdmin = userData.isAdmin === true;
//             }
//         }
        
//         // Store user data
//         localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
//         localStorage.setItem("currentUser", JSON.stringify({
//             uid: user.uid,
//             email: user.email,
//             isAdmin: isAdmin
//         }));
        
//         if (isAdmin) {
//             alert("Admin Login Successful!");
//             window.location.href = "admin.html";
//         } else {
//             alert("Login Successful!");
//             window.location.href = "profile.html";
//         }
//     } catch (error) {
//         console.error("Login Error:", error);
        
//         if (error.code === 'auth/user-not-found') {
//             alert("No account found! Please register first.");
//         } else if (error.code === 'auth/wrong-password') {
//             alert("Incorrect password! Please try again.");
//         } else if (error.code === 'auth/invalid-email') {
//             alert("Invalid email format!");
//         } else {
//             alert("Login failed: " + error.message);
//         }
//     }
// };

// // ================= ADD PRODUCT FUNCTION =================
// window.addProduct = async function() {
//     const name = document.getElementById("name").value;
//     const price = document.getElementById("price").value;
//     const mrp = document.getElementById("mrp").value;
//     const category = document.getElementById("category").value;
//     const rating = document.getElementById("rating").value;
//     const desc = document.getElementById("desc").value;
//     const image = document.getElementById("image").value;
//     const link = document.getElementById("link").value;

//     if (!name || !price || !image || !link) {
//         alert("Please fill required fields!");
//         return;
//     }

//     try {
//         await addDoc(collection(db, "products"), {
//             name: name,
//             price: price,
//             mrp: mrp || price,
//             category: category || "General",
//             rating: parseInt(rating) || 5,
//             description: desc,
//             image: image,
//             link: link,
//             createdAt: new Date().toISOString()
//         });
        
//         alert("Product Added Successfully!");
//         location.reload();
//     } catch (error) {
//         alert("Error: " + error.message);
//     }
// };

// // ================= LOAD PRODUCTS FUNCTION =================
// window.loadProducts = async function() {
//     const isAdmin = localStorage.getItem("isAdmin") === "true";
    
//     try {
//         const querySnapshot = await getDocs(collection(db, "products"));
//         const products = [];
//         querySnapshot.forEach((doc) => {
//             products.push({ id: doc.id, ...doc.data() });
//         });
        
//         products.reverse(); // Newest first
        
//         // Admin Table View
//         const table = document.getElementById("productTable");
//         if (table) {
//             const tbody = table.querySelector("tbody");
//             if (tbody) {
//                 tbody.innerHTML = "";
//                 if (products.length === 0) {
//                     tbody.innerHTML = "<tr><td colspan='4'>No products available</td></tr>";
//                 } else {
//                     products.forEach((product) => {
//                         tbody.innerHTML += `
//                             <tr>
//                                 <td><img src="${product.image}" width="50" height="50" style="object-fit:cover;"></td>
//                                 <td>${product.name}</td>
//                                 <td>₹${product.price}</td>
//                                 <td><button onclick="deleteProduct('${product.id}')">Delete</button></td>
//                             </tr>
//                         `;
//                     });
//                 }
//             }
//         }
        
//         // User Grid View
//         const grid = document.getElementById("productList");
//         if (grid) {
//             grid.innerHTML = "";
//             if (products.length === 0) {
//                 grid.innerHTML = "<p>No products available</p>";
//             } else {
//                 products.forEach((product) => {
//                     const stars = "★".repeat(product.rating || 5) + "☆".repeat(5 - (product.rating || 5));
//                     grid.innerHTML += `
//                         <div style="border:1px solid #ddd; padding:15px; margin:10px; border-radius:10px; background:#fff;">
//                             <img src="${product.image}" style="width:100%; height:150px; object-fit:contain;">
//                             <h3>${product.name}</h3>
//                             <p style="color:#ffa41c;">${stars}</p>
//                             <p><del>₹${product.mrp}</del> <strong>₹${product.price}</strong></p>
//                             <p style="font-size:12px; color:#666;">${(product.description || '').substring(0, 80)}</p>
//                             <a href="${product.link}" target="_blank"><button style="width:100%;">Buy Now</button></a>
//                         </div>
//                     `;
//                 });
//             }
//         }
//     } catch (error) {
//         console.error("Error loading products:", error);
//     }
// };

// // ================= DELETE PRODUCT FUNCTION =================
// window.deleteProduct = async function(productId) {
//     if (!confirm("Delete this product?")) return;
    
//     try {
//         await deleteDoc(doc(db, "products", productId));
//         alert("Product deleted!");
//         window.loadProducts();
//     } catch (error) {
//         alert("Error: " + error.message);
//     }
// };

// // ================= LOAD USERS FUNCTION =================
// window.loadUsers = async function() {
//     const table = document.getElementById("userTable");
//     if (!table) return;
    
//     try {
//         const querySnapshot = await getDocs(collection(db, "users"));
//         const tbody = table.querySelector("tbody");
//         if (tbody) {
//             tbody.innerHTML = "";
//             querySnapshot.forEach((doc) => {
//                 const user = doc.data();
//                 if (!user.isAdmin) {
//                     tbody.innerHTML += `
//                         <tr>
//                             <td>${user.name || 'N/A'}</td>
//                             <td>${user.email}</td>
//                             <td>${user.area || 'N/A'}</td>
//                         </tr>
//                     `;
//                 }
//             });
//         }
//     } catch (error) {
//         console.error("Error loading users:", error);
//     }
// };

// // ================= LOAD PROFILE FUNCTION =================
// window.loadProfile = function() {
//     const user = JSON.parse(localStorage.getItem("currentUser"));
//     if (!user) return;
    
//     const nameEl = document.getElementById("userName");
//     const emailEl = document.getElementById("userEmail");
//     if (nameEl) nameEl.innerText = "Name: " + (user.name || user.email);
//     if (emailEl) emailEl.innerText = "Email: " + user.email;
// };

// // ================= LOGOUT FUNCTION =================
// window.logout = async function() {
//     await signOut(auth);
//     localStorage.clear();
//     window.location.href = "login.html";
// };

// // ================= CHECK AUTH FUNCTION =================
// window.checkAuth = function() {
//     const isAdmin = localStorage.getItem("isAdmin");
//     const currentUser = localStorage.getItem("currentUser");
//     const path = window.location.pathname.split("/").pop();
    
//     if (path === "login.html" || path === "register.html") return;
    
//     if (path === "admin.html" && isAdmin !== "true") {
//         window.location.href = "login.html";
//     } else if (path === "profile.html" && !currentUser) {
//         window.location.href = "login.html";
//     }
// };

// // Initialize on page load
// if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", () => {
//         window.checkAuth();
//         window.loadProducts();
//         window.loadUsers();
//         window.loadProfile();
//     });
// } else {
//     window.checkAuth();
//     window.loadProducts();
//     window.loadUsers();
//     window.loadProfile();
// }