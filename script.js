const products = [
  {id:1, name:"Classic Premium Watch", category:"Watches", price:1890, old:2290, emoji:"⌚", desc:"স্টাইলিশ ও প্রিমিয়াম ডিজাইনের ঘড়ি"},
  {id:2, name:"Luxury Couple Watch", category:"Watches", price:2490, old:2990, emoji:"⌚", desc:"কাপলদের জন্য এলিগ্যান্ট কালেকশন"},
  {id:3, name:"Premium Silk Saree", category:"Saree", price:1850, old:2200, emoji:"🥻", desc:"উৎসব ও বিশেষ দিনের জন্য"},
  {id:4, name:"Elegant Printed Saree", category:"Saree", price:1290, old:1590, emoji:"🥻", desc:"আরামদায়ক ও ট্রেন্ডি ডিজাইন"},
  {id:5, name:"Royal Panjabi", category:"Panjabi", price:1590, old:1890, emoji:"👔", desc:"ঈদ ও উৎসবের জন্য স্টাইলিশ পাঞ্জাবি"},
  {id:6, name:"Embroidered Panjabi", category:"Panjabi", price:2190, old:2490, emoji:"👔", desc:"প্রিমিয়াম এমব্রয়ডারি ও ফিটিং"},
  {id:7, name:"Beauty Care Combo", category:"Beauty", price:1490, old:1790, emoji:"💄", desc:"দৈনন্দিন ব্যবহারের বিউটি কম্বো"},
  {id:8, name:"Makeup Essentials", category:"Beauty", price:990, old:1250, emoji:"💄", desc:"মেকআপের প্রয়োজনীয় কিছু পণ্য"}
];

let cart = JSON.parse(localStorage.getItem("trendoraCart") || "[]");
let activeFilter = "All";

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

function taka(n){ return "৳" + n.toLocaleString("bn-BD"); }

function renderProducts(){
  const q = searchInput.value.trim().toLowerCase();
  const list = products.filter(p =>
    (activeFilter==="All" || p.category===activeFilter) &&
    (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  );
  grid.innerHTML = list.length ? list.map(p=>`
    <article class="product-card">
      <div class="product-art">${p.emoji}</div>
      <div class="product-info">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div><span class="price">${taka(p.price)}</span><span class="old">${taka(p.old)}</span></div>
        <button class="add" onclick="addToCart(${p.id})">কার্টে যোগ করুন +</button>
      </div>
    </article>
  `).join("") : `<div class="empty" style="grid-column:1/-1">কোনো পণ্য পাওয়া যায়নি।</div>`;
}

function save(){ localStorage.setItem("trendoraCart", JSON.stringify(cart)); renderCart(); }

window.addToCart = function(id){
  const item = cart.find(x=>x.id===id);
  if(item) item.qty++;
  else cart.push({id, qty:1});
  save(); openCart();
};

function renderCart(){
  const box = document.getElementById("cartItems");
  document.getElementById("cartCount").textContent = cart.reduce((s,x)=>s+x.qty,0);
  if(!cart.length){
    box.innerHTML = '<div class="empty">আপনার কার্ট এখনো খালি 🛒</div>';
    document.getElementById("cartTotal").textContent = "৳0";
    return;
  }
  let total=0;
  box.innerHTML = cart.map(item=>{
    const p=products.find(x=>x.id===item.id); total += p.price*item.qty;
    return `<div class="cart-row">
      <div class="cart-emoji">${p.emoji}</div>
      <div style="flex:1"><strong>${p.name}</strong><small>${taka(p.price)} × ${item.qty}</small>
      <div class="qty">
        <button onclick="changeQty(${p.id},-1)">−</button><span>${item.qty}</span><button onclick="changeQty(${p.id},1)">+</button>
      </div></div>
      <button class="remove" onclick="removeItem(${p.id})">মুছুন</button>
    </div>`;
  }).join("");
  document.getElementById("cartTotal").textContent = taka(total);
}
window.changeQty=function(id,d){
  const x=cart.find(i=>i.id===id); if(!x)return;
  x.qty+=d; if(x.qty<=0) cart=cart.filter(i=>i.id!==id); save();
};
window.removeItem=function(id){ cart=cart.filter(i=>i.id!==id); save(); };

function openCart(){ document.getElementById("cartDrawer").classList.add("open"); document.getElementById("overlay").classList.add("show"); }
function closeCart(){ document.getElementById("cartDrawer").classList.remove("open"); document.getElementById("overlay").classList.remove("show"); }

document.getElementById("cartOpen").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
document.getElementById("overlay").onclick=closeCart;

document.querySelectorAll(".filter").forEach(btn=>{
  btn.onclick=()=>{
    document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active"); activeFilter=btn.dataset.filter; renderProducts();
  };
});
document.querySelectorAll(".category-card").forEach(btn=>{
  btn.onclick=()=>{
    activeFilter=btn.dataset.category;
    document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===activeFilter));
    document.getElementById("products").scrollIntoView({behavior:"smooth"}); renderProducts();
  };
});
searchInput.addEventListener("input",renderProducts);
document.getElementById("searchBtn").onclick=renderProducts;

document.getElementById("checkoutBtn").onclick=()=>{
  if(!cart.length){ alert("কার্টে কোনো পণ্য নেই।"); return; }
  alert("ডেমো অর্ডার: এখানে আপনার WhatsApp/ফোন/পেমেন্ট checkout যুক্ত করতে পারবেন।");
};

document.getElementById("year").textContent=new Date().getFullYear();
renderProducts(); renderCart();
