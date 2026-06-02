async function api(url, opt={}) { return fetch(url,opt).then(r=>r.json()); }

let current=null;
const text=document.getElementById("text");
const u=document.getElementById("u");
const p=document.getElementById("p");

async function load() {
  const d=await api("/api/tree");
  const tree=document.getElementById("tree");
  tree.innerHTML="";
  d.files.forEach(f=>{
    const li=document.createElement("li");
    li.innerText=f.name;
    li.onclick=async ()=>{
      current=f;
      const res=await fetch("/api/file/"+f.id);
      const data=await res.json();
      text.value=data.content||"";
    };
    tree.appendChild(li);
  });
}

async function save() {
  if(!current)return;
  await fetch("/api/file",{
    method:"PUT",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({id:current.id,content:text.value})
  });
}

async function login() {
  const r=await api("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:u.value,password:p.value})});
  localStorage.setItem("token",r.token);
  location.href="/app.html";
}

load();