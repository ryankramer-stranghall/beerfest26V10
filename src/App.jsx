import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────
   BRAND TOKENS  (pulled from the event banner)
───────────────────────────────────────────── */
const B = {
  red:       "#D94B35",
  tealDark:  "#1E4E52",
  tealMid:   "#3A7C7E",
  tealLight: "#A8CECC",
  tealPale:  "#C9E0DE",
  cream:     "#F5EDD8",
  gold:      "#C49A3C",
  goldLight: "#D4B96A",
  white:     "#FFFFFF",
};

/* Google Font – Barlow Condensed for that retro poster feel */
const injectFont = () => {
  if (document.getElementById("bf-font")) return;
  const l = document.createElement("link");
  l.id   = "bf-font";
  l.rel  = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&display=swap";
  document.head.appendChild(l);
};
injectFont();

const DISPLAY = "'Barlow Condensed', sans-serif";
const BODY    = "'Barlow', sans-serif";

/* ─────────────────────────────────────────────
   VENDOR DATA
───────────────────────────────────────────── */
const DEFAULT_VENDORS = [
  { id: "casual-animal",  name: "Casual Animal",     location: "Crossroads KC",    type: "brewery" },
  { id: "discourse",      name: "Discourse",          location: "Overland Park KS", type: "brewery" },
  { id: "strange-days",   name: "Strange Days",       location: "Downtown KC",      type: "brewery" },
  { id: "sockyards",      name: "Sockyards",          location: "West Bottoms KC",  type: "brewery" },
  { id: "martin-city",    name: "Martin City",        location: "Overland Park KS", type: "brewery" },
  { id: "cinder-block",   name: "Cinder Block",       location: "North KC",         type: "brewery" },
  { id: "sandhills",      name: "Sandhills",          location: "Mission KS",       type: "brewery" },
  { id: "limitless",      name: "Limitless",          location: "Lenexa KS",        type: "brewery" },
  { id: "boulevard",      name: "Boulevard",          location: "Crossroads KC",    type: "brewery" },
  { id: "kc-bier",        name: "KC Bier",            location: "KC Proper",        type: "brewery" },
  { id: "torn-label",     name: "Torn Label",         location: "Crossroads KC",    type: "brewery" },
  { id: "bees-knees",     name: "Bees Knees Brewing", location: "Versailles MO",    type: "brewery" },
  { id: "vine-street",    name: "Vine Street",        location: "KC Proper",        type: "brewery" },
  { id: "logboat",        name: "Logboat",            location: "Columbia MO",      type: "brewery" },
  { id: "border-brewing", name: "Border Brewing",     location: "Crossroads KC",    type: "brewery" },
  { id: "transparent",    name: "Transparent",        location: "Grandview MO",     type: "brewery" },
  { id: "stem-ciders",    name: "Stem Ciders",        location: "Lafayette CO",     type: "brewery" },
  { id: "toms-town",      name: "Tom's Town",         location: "Crossroads KC",    type: "distillery" },
  { id: "rieger",         name: "Rieger",             location: "KC Proper",        type: "distillery" },
  { id: "lifted-spirits", name: "Lifted Spirits",     location: "Crossroads KC",    type: "distillery" },
  { id: "union-horse",    name: "Union Horse",        location: "Lenexa KS",        type: "distillery" },
  { id: "djw-drinks",     name: "DJW Drinks",         location: "KC Proper",        type: "na" },
];

/* ─────────────────────────────────────────────
   STORAGE
───────────────────────────────────────────── */
const ADMIN_PASSWORD = "beerfest2026";
const SESSIONS_KEY   = "beerfest26_sessions";
const BEERS_KEY      = "beerfest26_beers";
const VENDORS_KEY    = "beerfest26_vendors";
const PHOTOS_KEY     = "beerfest26_photos";

const loadSessions = () => { try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]"); } catch { return []; } };
const loadBeerList = () => { try { return JSON.parse(localStorage.getItem(BEERS_KEY)    || "{}"); } catch { return {}; } };
const loadVendors  = () => { try { return JSON.parse(localStorage.getItem(VENDORS_KEY)  || "null") || DEFAULT_VENDORS; } catch { return DEFAULT_VENDORS; } };
const loadPhotos   = () => { try { return JSON.parse(localStorage.getItem(PHOTOS_KEY)   || "[]"); } catch { return []; } };

const saveSession  = (s)  => { try { const a=loadSessions(); const i=a.findIndex(x=>x.email===s.email); if(i>=0)a[i]=s;else a.push(s); localStorage.setItem(SESSIONS_KEY,JSON.stringify(a)); } catch {} };
const saveBeerList = (bl) => { try { localStorage.setItem(BEERS_KEY,   JSON.stringify(bl)); } catch {} };
const saveVendors  = (v)  => { try { localStorage.setItem(VENDORS_KEY, JSON.stringify(v));  } catch {} };
const savePhotos   = (p)  => { try { localStorage.setItem(PHOTOS_KEY,  JSON.stringify(p));  } catch {} };

/* ─────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <div style={{ fontFamily:DISPLAY, fontWeight:800, fontSize:11, letterSpacing:3, textTransform:"uppercase", color:B.tealDark, opacity:0.5, marginBottom:7 }}>{children}</div>
);

const Pill = ({ children, color = B.red }) => (
  <span style={{ display:"inline-block", background:color, color:B.cream, fontFamily:DISPLAY, fontWeight:800, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", padding:"3px 9px", borderRadius:4 }}>{children}</span>
);

function Stars({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display:"flex", gap:2 }}>
      {[1,2,3,4,5].map(n=>(
        <span key={n} onClick={()=>onChange(n===value?0:n)} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)}
          style={{ fontSize:size, cursor:"pointer", userSelect:"none", opacity:n<=(hover||value)?1:0.18, transition:"opacity 0.1s,transform 0.1s", transform:hover===n?"scale(1.3)":"scale(1)", display:"inline-block" }}>🍺</span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   VENDOR CARD
───────────────────────────────────────────── */
function VendorCard({ vendor, beerList, notes, onChange, isOpen, onToggle }) {
  const beers      = beerList[vendor.id] || [];
  const ratings    = notes.ratings || {};
  const ratedVals  = Object.values(ratings).filter(r=>r>0);
  const ratedCount = ratedVals.length;
  const avgRating  = ratedVals.length ? ratedVals.reduce((a,b)=>a+b,0)/ratedVals.length : 0;
  const typeIcon   = vendor.type==="brewery"?"🍺":vendor.type==="distillery"?"🥃":"🧃";
  const typeColor  = vendor.type==="brewery"?B.red:vendor.type==="distillery"?B.tealMid:B.tealLight;
  const typeLabel  = vendor.type==="distillery"?"Spirits":vendor.type==="na"?"Drinks":"Beers";

  return (
    <div style={{ background:isOpen?B.cream:"white", border:`2px solid ${isOpen?B.red:B.tealLight}`, borderRadius:12, marginBottom:10, overflow:"hidden", transition:"all 0.2s", boxShadow:isOpen?`0 4px 24px ${B.red}22`:"0 2px 8px rgba(30,78,82,0.07)" }}>
      <div onClick={onToggle} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", cursor:"pointer" }}>
        <div style={{ width:40,height:40,borderRadius:8,flexShrink:0,background:typeColor+"22",border:`2px solid ${typeColor}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19 }}>{typeIcon}</div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontFamily:DISPLAY,fontWeight:800,fontSize:16,color:B.tealDark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{vendor.name}</div>
          <div style={{ fontFamily:BODY,fontSize:11,color:B.tealMid,opacity:0.65 }}>{vendor.location}</div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
          {ratedCount>0 && (
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:12 }}>{"🍺".repeat(Math.round(avgRating))}</div>
              <div style={{ fontFamily:BODY, color:B.tealMid, fontSize:10, opacity:0.6 }}>{ratedCount} rated</div>
            </div>
          )}
          <div style={{ color:B.red,fontSize:18,fontWeight:900,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s" }}>▾</div>
        </div>
      </div>

      {isOpen && (
        <div style={{ padding:"0 16px 18px", borderTop:`1px solid ${B.red}22` }}>
          <div style={{ height:12 }} />
          {beers.length===0 ? (
            <div style={{ fontFamily:BODY,color:B.tealMid,fontSize:13,fontStyle:"italic",opacity:0.5,marginBottom:14 }}>No {typeLabel.toLowerCase()} listed yet.</div>
          ) : (
            <div style={{ marginBottom:16 }}>
              <SectionLabel>{typeLabel} Poured</SectionLabel>
              {beers.map((beer,i) => beer.trim() ? (
                <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",gap:12,borderBottom:i<beers.length-1?`1px solid ${B.tealLight}55`:"none" }}>
                  <div style={{ fontFamily:BODY,color:B.tealDark,fontSize:14,fontWeight:600,flex:1 }}>{beer}</div>
                  <Stars value={ratings[i]||0} onChange={r=>onChange({...notes,ratings:{...ratings,[i]:r}})} size={22} />
                </div>
              ) : null)}
            </div>
          )}
          <SectionLabel>Your Notes</SectionLabel>
          <textarea value={notes.text||""} onChange={e=>onChange({...notes,text:e.target.value})} placeholder="Anything else worth remembering…" rows={3}
            style={{ width:"100%",background:B.tealPale+"66",border:`1px solid ${B.tealLight}`,borderRadius:8,color:B.tealDark,fontSize:13,fontFamily:BODY,padding:"10px 12px",resize:"vertical",outline:"none",boxSizing:"border-box" }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CLOUDINARY CONFIG
───────────────────────────────────────────── */
const CLOUDINARY_CLOUD  = "drggerg1n";
const CLOUDINARY_PRESET = "beerfest26";
const CLOUDINARY_FOLDER = "beerfest26_event";

// Build a Cloudinary URL with the Beer Fest logo watermarked bottom-right
// Uses Cloudinary's overlay transformation — the logo must be uploaded to your
// Cloudinary media library as "beerfest26_logo" for this to appear.
const cloudinaryWatermarked = (publicId) => {
  const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload`;
  const transforms = [
    "w_800,c_limit,q_auto,f_auto",
    "l_beerfest26_logo,w_120,o_40,g_south_east,x_12,y_12",
  ].join("/");
  return `${base}/${transforms}/${publicId}`;
};

const cloudinaryThumb = (publicId) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/w_300,h_300,c_fill,q_auto,f_auto/${publicId}`;
};

const CLOUD_PHOTOS_KEY = "beerfest26_cloud_photos"; // [{publicId, takenAt, uploaderName}]
const loadCloudPhotos  = () => { try { return JSON.parse(localStorage.getItem(CLOUD_PHOTOS_KEY) || "[]"); } catch { return []; } };
const saveCloudPhotos  = (p)  => { try { localStorage.setItem(CLOUD_PHOTOS_KEY, JSON.stringify(p)); } catch {} };

/* ─────────────────────────────────────────────
   PHOTO UPLOAD
───────────────────────────────────────────── */
function PhotoUpload({ uploaderName = "" }) {
  const [photos, setPhotos]     = useState(loadCloudPhotos());
  const [lightbox, setLightbox] = useState(null);
  const [uploading, setUploading] = useState([]);  // array of filenames being uploaded
  const fileRef   = useRef(null);
  const cameraRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);
    formData.append("folder", CLOUDINARY_FOLDER);
    if (uploaderName) formData.append("context", `uploader=${uploaderName}`);

    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:"POST", body:formData });
    const data = await res.json();
    return data.public_id;
  };

  const handleFiles = async (files) => {
    const fileArr = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (!fileArr.length) return;

    setUploading(fileArr.map(f => f.name));
    const results = await Promise.allSettled(fileArr.map(f => uploadToCloudinary(f)));
    setUploading([]);

    const newPhotos = results
      .filter(r => r.status === "fulfilled")
      .map(r => ({
        publicId: r.value,
        takenAt: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}),
        uploaderName: uploaderName || "Guest",
      }));

    setPhotos(prev => {
      const updated = [...newPhotos, ...prev];
      saveCloudPhotos(updated);
      return updated;
    });
  };

  const remove = (publicId) => {
    setPhotos(prev => { const u = prev.filter(p => p.publicId !== publicId); saveCloudPhotos(u); return u; });
    if (lightbox === publicId) setLightbox(null);
  };

  return (
    <div style={{ width:"100%", maxWidth:400, marginTop:24 }}>
      <div style={{ background:B.cream, border:`2px solid ${B.tealLight}`, borderRadius:14, padding:"20px 20px 22px" }}>
        <div style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:20, color:B.tealDark, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>📸 Event Photos</div>
        <div style={{ fontFamily:BODY, fontSize:11, color:B.tealMid, opacity:0.6, marginBottom:14 }}>Photos upload to the cloud — visible to everyone after the event ☁️</div>

        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <button onClick={()=>cameraRef.current?.click()} disabled={uploading.length>0}
            style={{ flex:1,padding:"10px 0",borderRadius:8,background:uploading.length>0?"#aaa":B.red,border:"none",color:B.cream,fontFamily:DISPLAY,fontWeight:900,fontSize:14,letterSpacing:0.5,textTransform:"uppercase",cursor:uploading.length>0?"not-allowed":"pointer",boxShadow:uploading.length>0?"none":`0 3px 12px ${B.red}44` }}>
            {uploading.length>0 ? "Uploading…" : "📷 Take Photo"}
          </button>
          <button onClick={()=>fileRef.current?.click()} disabled={uploading.length>0}
            style={{ flex:1,padding:"10px 0",borderRadius:8,background:uploading.length>0?"#aaa":B.tealDark,border:"none",color:B.cream,fontFamily:DISPLAY,fontWeight:900,fontSize:14,letterSpacing:0.5,textTransform:"uppercase",cursor:uploading.length>0?"not-allowed":"pointer" }}>
            {uploading.length>0 ? "…" : "🖼 Upload"}
          </button>
        </div>

        <input ref={cameraRef} type="file" accept="image/*" capture="environment" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)} />
        <input ref={fileRef}   type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)} />

        {/* Upload progress */}
        {uploading.length > 0 && (
          <div style={{ background:B.tealPale, borderRadius:8, padding:"10px 14px", marginBottom:14, fontFamily:BODY, fontSize:12, color:B.tealDark }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:14,height:14,border:`2px solid ${B.tealDark}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite" }} />
              Uploading {uploading.length} photo{uploading.length!==1?"s":""}…
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}

        {photos.length > 0 ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {photos.map(photo => (
              <div key={photo.publicId} style={{ position:"relative",aspectRatio:"1",borderRadius:8,overflow:"hidden",border:`2px solid ${B.tealLight}`,cursor:"pointer" }}>
                <img
                  src={cloudinaryThumb(photo.publicId)}
                  alt="event photo"
                  onClick={()=>setLightbox(photo.publicId)}
                  style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }}
                />
                <button onClick={e=>{e.stopPropagation();remove(photo.publicId);}}
                  style={{ position:"absolute",top:4,right:4,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,0.6)",border:"none",color:"white",fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.55))",padding:"4px 5px" }}>
                  <div style={{ color:"rgba(255,255,255,0.85)",fontSize:9,fontFamily:BODY }}>{photo.uploaderName}</div>
                  <div style={{ color:"rgba(255,255,255,0.55)",fontSize:8,fontFamily:BODY }}>{photo.takenAt}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border:`2px dashed ${B.tealLight}`,borderRadius:10,padding:"20px 16px",textAlign:"center",color:B.tealMid,fontFamily:BODY,fontSize:13,opacity:0.6 }}>
            No photos yet — snap some memories!
          </div>
        )}
      </div>

      {/* Lightbox — shows watermarked version */}
      {lightbox && (() => {
        const photo = photos.find(p => p.publicId === lightbox);
        return photo ? (
          <div onClick={()=>setLightbox(null)} style={{ position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.92)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
            <img src={cloudinaryWatermarked(photo.publicId)} alt="event photo"
              style={{ maxWidth:"100%",maxHeight:"90vh",borderRadius:12,objectFit:"contain" }} />
            <div style={{ position:"absolute",bottom:32,left:0,right:0,textAlign:"center",fontFamily:BODY,fontSize:12,color:"rgba(255,255,255,0.4)" }}>
              📍 {photo.uploaderName} · {photo.takenAt}
            </div>
            <button onClick={()=>setLightbox(null)} style={{ position:"absolute",top:20,right:20,background:"rgba(255,255,255,0.12)",border:"none",color:"white",fontSize:20,width:40,height:40,borderRadius:"50%",cursor:"pointer" }}>✕</button>
          </div>
        ) : null;
      })()}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ADMIN PANEL
───────────────────────────────────────────── */
function BeerSetupPanel({ onBack }) {
  const [pw, setPw]             = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pwError, setPwError]   = useState("");
  const [beerList, setBeerList] = useState(loadBeerList());
  const [vendors, setVendors]   = useState(loadVendors());
  const [activeV, setActiveV]   = useState(null);
  const [saved, setSaved]       = useState(false);

  const unlock = () => pw===ADMIN_PASSWORD ? setUnlocked(true) : setPwError("Incorrect password.");

  const updateVendorName     = (id,name)     => { setVendors(p=>p.map(v=>v.id===id?{...v,name}:v));     setSaved(false); };
  const updateVendorLocation = (id,location) => { setVendors(p=>p.map(v=>v.id===id?{...v,location}:v)); setSaved(false); };
  const getBeers         = (id)       => beerList[id] || [""];
  const updateBeer       = (id,i,val) => { const n=[...getBeers(id)]; n[i]=val; setBeerList(p=>({...p,[id]:n})); setSaved(false); };
  const addBeer          = (id)       => { setBeerList(p=>({...p,[id]:[...getBeers(id),""] })); setSaved(false); };
  const removeBeer       = (id,i)     => { const n=getBeers(id).filter((_,x)=>x!==i); setBeerList(p=>({...p,[id]:n.length?n:[""]})); setSaved(false); };

  const handleSave = () => { saveBeerList(beerList); saveVendors(vendors); setSaved(true); setTimeout(()=>setSaved(false),2000); };

  // ── Add new vendor ──
  const [newName, setNewName]         = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType]         = useState("brewery");
  const [showAddForm, setShowAddForm] = useState(false);

  const addVendor = () => {
    if (!newName.trim()) return;
    const id = "custom-" + Date.now();
    setVendors(p => [...p, { id, name: newName.trim(), location: newLocation.trim() || "Location TBD", type: newType }]);
    setNewName(""); setNewLocation(""); setNewType("brewery"); setShowAddForm(false); setSaved(false);
  };

  const removeVendor = (id) => {
    setVendors(p => p.filter(v => v.id !== id));
    setBeerList(p => { const n={...p}; delete n[id]; return n; });
    setSaved(false);
  };

  // ── In-app tasting report ──
  const [showReport, setShowReport]   = useState(false);
  const [reportVendor, setReportVendor] = useState("all");

  const exportCSV = () => {
    const sessions = loadSessions();
    const rows = [["Name","Email","Marketing Opt-in","Vendor","Location","Type","Beer / Pour","Mug Rating (1-5)","Notes"]];
    sessions.forEach(s=>{
      const entries=[];
      Object.entries(s.tastingNotes||{}).forEach(([vid,vn])=>{
        const vendor=vendors.find(v=>v.id===vid); const beers=beerList[vid]||[]; const ratings=vn.ratings||{};
        beers.forEach((beer,i)=>{ if(beer.trim()&&ratings[i]) entries.push([s.name,s.email,s.optedIn?"Yes":"No",vendor?.name||vid,vendor?.location||"",vendor?.type||"",beer,ratings[i],""]); });
        if(vn.text) entries.push([s.name,s.email,s.optedIn?"Yes":"No",vendor?.name||vid,vendor?.location||"",vendor?.type||"","(notes)","",vn.text]);
      });
      if(!entries.length) rows.push([s.name,s.email,s.optedIn?"Yes":"No","","","","","",""]);
      else entries.forEach(e=>rows.push(e));
    });
    const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="beerfest26_tasting_notes.csv"; a.click();
  };

  const inputBase = { width:"100%", padding:"10px 14px", borderRadius:8, border:`2px solid ${B.tealLight}`, background:"white", color:B.tealDark, fontSize:14, fontFamily:BODY, outline:"none", boxSizing:"border-box" };


  if (!unlocked) return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg,${B.tealDark} 0%,${B.tealMid} 100%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:BODY, padding:20 }}>
      <div style={{ background:B.cream, borderRadius:18, padding:"36px 28px", width:"100%", maxWidth:340, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontSize:40, marginBottom:10 }}>🔒</div>
        <div style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:28, color:B.tealDark, textTransform:"uppercase", marginBottom:4 }}>Admin Access</div>
        <div style={{ color:B.tealMid, fontSize:13, marginBottom:24 }}>Beer Fest 2026</div>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&unlock()} placeholder="Password" style={{...inputBase,marginBottom:10}} />
        {pwError && <div style={{ color:B.red, fontSize:12, marginBottom:10, fontWeight:600 }}>{pwError}</div>}
        <button onClick={unlock} style={{ width:"100%",padding:13,background:B.red,color:B.cream,border:"none",borderRadius:8,fontFamily:DISPLAY,fontWeight:900,fontSize:17,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",boxShadow:`0 4px 16px ${B.red}55` }}>Unlock</button>
        <div onClick={onBack} style={{ color:B.tealMid, fontSize:12, marginTop:18, cursor:"pointer", opacity:0.6 }}>← Back to app</div>
      </div>
    </div>
  );

  const sessions=loadSessions();
  const totalOptIns=sessions.filter(s=>s.optedIn).length;
  const totalRatings=sessions.reduce((a,s)=>a+Object.values(s.tastingNotes||{}).reduce((b,v)=>b+Object.values(v.ratings||{}).filter(r=>r>0).length,0),0);

  // ── In-app report view ──
  if (showReport) {
    const filteredVendors = reportVendor === "all" ? vendors : vendors.filter(v=>v.id===reportVendor);
    return (
      <div style={{ minHeight:"100vh", background:B.tealPale, fontFamily:BODY, padding:"24px 16px 60px" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <Pill>Tasting Report</Pill>
              <div style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:26, color:B.tealDark, textTransform:"uppercase", marginTop:6 }}>All Ratings</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={exportCSV} style={{ padding:"8px 14px",background:B.red,color:B.cream,border:"none",borderRadius:8,fontFamily:DISPLAY,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer" }}>⬇ CSV</button>
              <button onClick={()=>setShowReport(false)} style={{ padding:"8px 14px",background:"white",color:B.tealDark,border:`2px solid ${B.tealLight}`,borderRadius:8,fontSize:12,fontFamily:DISPLAY,fontWeight:700,cursor:"pointer",textTransform:"uppercase" }}>← Back</button>
            </div>
          </div>

          {/* Filter by vendor */}
          <div style={{ marginBottom:20 }}>
            <select value={reportVendor} onChange={e=>setReportVendor(e.target.value)}
              style={{ width:"100%",padding:"10px 14px",borderRadius:8,border:`2px solid ${B.tealLight}`,background:"white",color:B.tealDark,fontSize:14,fontFamily:BODY,outline:"none",cursor:"pointer" }}>
              <option value="all">All Vendors</option>
              {vendors.map(v=><option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          {sessions.length === 0 && (
            <div style={{ background:"white",borderRadius:12,padding:"32px 20px",textAlign:"center",color:B.tealMid,fontFamily:BODY,fontSize:14,opacity:0.6 }}>No participants yet.</div>
          )}

          {filteredVendors.map(vendor => {
            const beers = beerList[vendor.id] || [];
            if (beers.filter(b=>b.trim()).length === 0) return null;
            const typeIcon = vendor.type==="brewery"?"🍺":vendor.type==="distillery"?"🥃":"🧃";

            return (
              <div key={vendor.id} style={{ background:"white", border:`2px solid ${B.tealLight}`, borderRadius:14, marginBottom:16, overflow:"hidden" }}>
                {/* Vendor header */}
                <div style={{ background:B.tealDark, padding:"12px 16px", display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:20 }}>{typeIcon}</span>
                  <div>
                    <div style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:18, color:B.cream, textTransform:"uppercase" }}>{vendor.name}</div>
                    <div style={{ fontFamily:BODY, fontSize:11, color:B.tealLight, opacity:0.7 }}>{vendor.location}</div>
                  </div>
                </div>

                {/* Table */}
                <div style={{ overflowX:"auto" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:BODY, fontSize:13 }}>
                    <thead>
                      <tr style={{ background:B.tealPale }}>
                        <th style={{ padding:"9px 14px", textAlign:"left", fontFamily:DISPLAY, fontWeight:800, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", color:B.tealDark, borderBottom:`2px solid ${B.tealLight}` }}>Attendee</th>
                        {beers.filter(b=>b.trim()).map((beer,i)=>(
                          <th key={i} style={{ padding:"9px 10px", textAlign:"center", fontFamily:DISPLAY, fontWeight:800, fontSize:11, letterSpacing:1, textTransform:"uppercase", color:B.tealDark, borderBottom:`2px solid ${B.tealLight}`, whiteSpace:"nowrap", maxWidth:120 }}>{beer}</th>
                        ))}
                        <th style={{ padding:"9px 10px", textAlign:"left", fontFamily:DISPLAY, fontWeight:800, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", color:B.tealDark, borderBottom:`2px solid ${B.tealLight}` }}>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map((s, si) => {
                        const vn = s.tastingNotes?.[vendor.id] || {};
                        const ratings = vn.ratings || {};
                        const hasAny = Object.values(ratings).some(r=>r>0) || vn.text;
                        if (!hasAny) return null;
                        return (
                          <tr key={si} style={{ borderBottom:`1px solid ${B.tealLight}55`, background:si%2===0?"white":B.tealPale+"44" }}>
                            <td style={{ padding:"9px 14px", color:B.tealDark, fontWeight:600, whiteSpace:"nowrap" }}>{s.name}</td>
                            {beers.filter(b=>b.trim()).map((beer,i)=>{
                              const origIdx = beers.indexOf(beer);
                              const r = ratings[origIdx] || 0;
                              return (
                                <td key={i} style={{ padding:"9px 10px", textAlign:"center" }}>
                                  {r > 0 ? (
                                    <div>
                                      <div style={{ fontSize:13, lineHeight:1 }}>{"🍺".repeat(r)}</div>
                                      <div style={{ fontFamily:DISPLAY, fontWeight:800, fontSize:12, color:B.gold, marginTop:2 }}>{r}/5</div>
                                    </div>
                                  ) : <span style={{ color:B.tealLight, fontSize:16 }}>—</span>}
                                </td>
                              );
                            })}
                            <td style={{ padding:"9px 10px", color:B.tealMid, fontSize:12, fontStyle: vn.text?"normal":"italic", opacity:vn.text?1:0.4, maxWidth:160 }}>{vn.text || "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Per-beer averages footer */}
                <div style={{ background:B.tealPale, padding:"10px 14px", display:"flex", gap:16, flexWrap:"wrap" }}>
                  {beers.filter(b=>b.trim()).map((beer,i)=>{
                    const origIdx = beers.indexOf(beer);
                    const vals = sessions.map(s=>s.tastingNotes?.[vendor.id]?.ratings?.[origIdx]).filter(r=>r>0);
                    const avg = vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : null;
                    return avg ? (
                      <div key={i} style={{ fontFamily:BODY, fontSize:12, color:B.tealDark }}>
                        <span style={{ fontWeight:700 }}>{beer}:</span> <span style={{ color:B.red, fontWeight:700 }}>{avg}/5</span> <span style={{ opacity:0.5 }}>avg ({vals.length} rated)</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:B.tealPale, fontFamily:BODY, padding:"24px 16px 80px" }}>
      <div style={{ maxWidth:580, margin:"0 auto" }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <Pill>Admin · Beer Fest 2026</Pill>
            <div style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:28, color:B.tealDark, textTransform:"uppercase", marginTop:6 }}>Event Setup</div>
          </div>
          <button onClick={onBack} style={{ padding:"8px 16px",background:"white",color:B.tealDark,border:`2px solid ${B.tealLight}`,borderRadius:8,fontSize:13,fontFamily:DISPLAY,fontWeight:700,cursor:"pointer",textTransform:"uppercase",letterSpacing:0.5 }}>← Back</button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
          {[{label:"Participants",val:sessions.length},{label:"Opt-ins",val:totalOptIns},{label:"Ratings",val:totalRatings}].map(stat=>(
            <div key={stat.label} style={{ background:"white",border:`2px solid ${B.tealLight}`,borderRadius:12,padding:"14px 10px",textAlign:"center" }}>
              <div style={{ fontFamily:DISPLAY,fontWeight:900,fontSize:30,color:B.red }}>{stat.val}</div>
              <div style={{ fontFamily:BODY,color:B.tealMid,fontSize:11,marginTop:2,fontWeight:600 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Report buttons */}
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <button onClick={()=>setShowReport(true)} style={{ flex:1,padding:14,background:B.tealDark,color:B.cream,border:"none",borderRadius:10,fontFamily:DISPLAY,fontWeight:900,fontSize:15,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",boxShadow:"0 4px 20px rgba(0,0,0,0.15)" }}>
            📊 View Tasting Report
          </button>
          <button onClick={exportCSV} style={{ flex:1,padding:14,background:B.red,color:B.cream,border:"none",borderRadius:10,fontFamily:DISPLAY,fontWeight:900,fontSize:15,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",boxShadow:`0 4px 20px ${B.red}44` }}>
            ⬇ Export CSV
          </button>
        </div>

        {/* Photo gallery & download */}
        {(() => {
          const photos = loadCloudPhotos();
          return (
            <div style={{ background:"white", border:`2px solid ${B.tealLight}`, borderRadius:12, padding:"14px 16px", marginBottom:28 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: photos.length > 0 ? 14 : 0 }}>
                <div>
                  <div style={{ fontFamily:DISPLAY, fontWeight:800, fontSize:15, color:B.tealDark }}>📸 Event Photos</div>
                  <div style={{ fontFamily:BODY, fontSize:12, color:B.tealMid, marginTop:2 }}>
                    {photos.length > 0 ? `${photos.length} photo${photos.length!==1?"s":""} uploaded to Cloudinary` : "No photos uploaded yet"}
                  </div>
                </div>
                {photos.length > 0 && (
                  <button
                    onClick={() => {
                      photos.forEach((photo, i) => {
                        const url = cloudinaryWatermarked(photo.publicId);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `beerfest26_photo_${String(i+1).padStart(3,"0")}.jpg`;
                        a.target = "_blank";
                        a.click();
                      });
                    }}
                    style={{ flexShrink:0, padding:"10px 16px", background:B.tealDark, color:B.cream, border:"none", borderRadius:8, fontFamily:DISPLAY, fontWeight:900, fontSize:13, textTransform:"uppercase", letterSpacing:0.5, cursor:"pointer" }}>
                    ⬇ Download All
                  </button>
                )}
              </div>
              {photos.length > 0 && (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                  {photos.map(photo => (
                    <div key={photo.publicId} style={{ position:"relative", aspectRatio:"1", borderRadius:6, overflow:"hidden", border:`1px solid ${B.tealLight}` }}>
                      <img src={cloudinaryThumb(photo.publicId)} alt="event"
                        style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,0.6))", padding:"3px 4px" }}>
                        <div style={{ color:"rgba(255,255,255,0.9)", fontSize:8, fontFamily:BODY, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{photo.uploaderName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── Add New Vendor ── */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontFamily:DISPLAY,fontWeight:900,fontSize:13,letterSpacing:2,textTransform:"uppercase",color:B.tealDark,opacity:0.5 }}>Add New Vendor</div>
            <button onClick={()=>setShowAddForm(p=>!p)} style={{ padding:"5px 14px",background:showAddForm?B.tealLight:B.tealDark,color:showAddForm?B.tealDark:B.cream,border:"none",borderRadius:7,fontFamily:DISPLAY,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer" }}>
              {showAddForm?"Cancel":"+ Add"}
            </button>
          </div>

          {showAddForm && (
            <div style={{ background:"white",border:`2px solid ${B.gold}88`,borderRadius:12,padding:"16px 16px 18px" }}>
              <div style={{ marginBottom:12 }}>
                <SectionLabel>Vendor Name</SectionLabel>
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="e.g. Boulevard Brewing…"
                  style={{...inputBase,fontFamily:DISPLAY,fontWeight:800,fontSize:15,border:`2px solid ${B.gold}88`}} />
              </div>
              <div style={{ marginBottom:12 }}>
                <SectionLabel>Location</SectionLabel>
                <input value={newLocation} onChange={e=>setNewLocation(e.target.value)} placeholder="City, State…" style={{...inputBase,fontSize:13}} />
              </div>
              <div style={{ marginBottom:16 }}>
                <SectionLabel>Category</SectionLabel>
                <div style={{ display:"flex", gap:8 }}>
                  {[{val:"brewery",icon:"🍺",label:"Brewery"},{val:"distillery",icon:"🥃",label:"Distillery / Spirits"},{val:"na",icon:"🧃",label:"N/A Drinks"}].map(t=>(
                    <button key={t.val} onClick={()=>setNewType(t.val)} style={{ flex:1,padding:"10px 6px",borderRadius:8,border:`2px solid ${newType===t.val?B.red:B.tealLight}`,background:newType===t.val?B.red+"11":"white",color:newType===t.val?B.red:B.tealMid,fontFamily:DISPLAY,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:0.3,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,transition:"all 0.15s" }}>
                      <span style={{ fontSize:18 }}>{t.icon}</span>{t.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={addVendor} disabled={!newName.trim()} style={{ width:"100%",padding:12,background:newName.trim()?B.tealDark:"#ccc",color:B.cream,border:"none",borderRadius:8,fontFamily:DISPLAY,fontWeight:900,fontSize:15,textTransform:"uppercase",letterSpacing:1,cursor:newName.trim()?"pointer":"not-allowed" }}>
                Add Vendor
              </button>
            </div>
          )}
        </div>

        {/* ── Vendor list ── */}
        <div style={{ fontFamily:DISPLAY,fontWeight:900,fontSize:13,letterSpacing:2,textTransform:"uppercase",color:B.tealDark,opacity:0.5,marginBottom:4 }}>Vendor Names & Offerings</div>
        <div style={{ fontFamily:BODY,color:B.tealMid,fontSize:12,marginBottom:16,opacity:0.8 }}>Edit names, locations, and offerings. Tap Save when done.</div>

        {vendors.map(vendor=>{
          const beers=getBeers(vendor.id); const isOpen=activeV===vendor.id; const filledCount=beers.filter(b=>b.trim()).length;
          const typeIcon=vendor.type==="brewery"?"🍺":vendor.type==="distillery"?"🥃":"🧃";
          const typeColor=vendor.type==="brewery"?B.red:vendor.type==="distillery"?B.tealMid:B.tealLight;
          const offeringLabel=vendor.type==="distillery"?"spirit/pour":vendor.type==="na"?"drink":"beer";
          const isCustom = vendor.id.startsWith("custom-");
          return (
            <div key={vendor.id} style={{ background:isOpen?B.cream:"white",border:`2px solid ${isOpen?B.red:B.tealLight}`,borderRadius:12,marginBottom:8,overflow:"hidden",transition:"all 0.15s" }}>
              <div onClick={()=>setActiveV(isOpen?null:vendor.id)} style={{ display:"flex",alignItems:"center",gap:12,padding:"11px 14px",cursor:"pointer" }}>
                <div style={{ width:34,height:34,borderRadius:7,background:typeColor+"22",border:`2px solid ${typeColor}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0 }}>{typeIcon}</div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:DISPLAY,fontWeight:800,fontSize:15,color:B.tealDark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{vendor.name}</div>
                  <div style={{ fontFamily:BODY,color:B.tealMid,fontSize:11,opacity:0.65 }}>{vendor.location}</div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:8,flexShrink:0 }}>
                  {filledCount>0 && <Pill color={B.tealDark}>{filledCount} added</Pill>}
                  {isCustom && <Pill color={B.gold}>New</Pill>}
                  <div style={{ color:B.red,fontSize:16,fontWeight:900,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s" }}>▾</div>
                </div>
              </div>
              {isOpen && (
                <div style={{ padding:"0 14px 18px",borderTop:`1px solid ${B.red}22` }}>
                  <div style={{ height:12 }} />
                  <div style={{ marginBottom:12 }}>
                    <SectionLabel>Vendor Name</SectionLabel>
                    <input value={vendor.name} onChange={e=>updateVendorName(vendor.id,e.target.value)} placeholder="Vendor name…"
                      style={{...inputBase,fontFamily:DISPLAY,fontWeight:800,fontSize:15,border:`2px solid ${B.gold}88`}} />
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <SectionLabel>Location</SectionLabel>
                    <input value={vendor.location} onChange={e=>updateVendorLocation(vendor.id,e.target.value)} placeholder="City, State…"
                      style={{...inputBase,fontSize:13}} />
                  </div>
                  <SectionLabel>Offerings</SectionLabel>
                  {beers.map((beer,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
                      <div style={{ width:22,height:22,borderRadius:"50%",background:B.tealLight+"55",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:B.tealDark,flexShrink:0,fontFamily:DISPLAY,fontWeight:800 }}>{i+1}</div>
                      <input value={beer} onChange={e=>updateBeer(vendor.id,i,e.target.value)}
                        placeholder={`${offeringLabel.charAt(0).toUpperCase()+offeringLabel.slice(1)} name…`}
                        style={{...inputBase,fontSize:13}} />
                      {beers.length>1 && (
                        <button onClick={()=>removeBeer(vendor.id,i)} style={{ width:30,height:30,borderRadius:"50%",background:B.red+"22",border:`1px solid ${B.red}55`,color:B.red,fontSize:16,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                      )}
                    </div>
                  ))}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                    <button onClick={()=>addBeer(vendor.id)} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:B.tealDark+"11",border:`1px solid ${B.tealDark}33`,borderRadius:7,color:B.tealDark,fontFamily:DISPLAY,fontWeight:800,fontSize:13,textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer" }}>
                      + Add {offeringLabel}
                    </button>
                    <button onClick={()=>{ if(window.confirm(`Remove ${vendor.name}?`)) removeVendor(vendor.id); }} style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 12px",background:B.red+"11",border:`1px solid ${B.red}33`,borderRadius:7,color:B.red,fontFamily:DISPLAY,fontWeight:800,fontSize:12,textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer" }}>
                      🗑 Remove Vendor
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <button onClick={handleSave} style={{ width:"100%",padding:14,background:saved?"#2d7a4f":B.tealDark,color:B.cream,border:"none",borderRadius:10,fontFamily:DISPLAY,fontWeight:900,fontSize:17,textTransform:"uppercase",letterSpacing:1,cursor:"pointer",marginTop:16,transition:"background 0.3s",boxShadow:"0 4px 20px rgba(0,0,0,0.2)" }}>
          {saved?"✓ Saved!":"Save All Changes"}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function BeerFestApp() {
  const [screen, setScreen]             = useState("welcome");
  const [userName, setUserName]         = useState("");
  const [userEmail, setUserEmail]       = useState("");
  const [optedIn, setOptedIn]           = useState(true);
  const [error, setError]               = useState("");
  const [tastingNotes, setTastingNotes] = useState({});
  const [activeVendor, setActiveVendor] = useState(null);
  const [filter, setFilter]             = useState("all");
  const [showAdmin, setShowAdmin]       = useState(false);
  const [beerList]                      = useState(loadBeerList());
  const [vendors]                       = useState(loadVendors());

  const filtered   = filter==="all" ? vendors : vendors.filter(v=>v.type===filter);
  const totalRated = Object.values(tastingNotes).reduce((a,v)=>a+Object.values(v.ratings||{}).filter(r=>r>0).length,0);

  // Auto-save whenever tastingNotes changes
  useEffect(() => {
    if (screen !== "tasting" && screen !== "done") return;
    if (!userName || !userEmail) return;
    saveSession({ name:userName, email:userEmail, optedIn, tastingNotes, savedAt:new Date().toISOString() });
  }, [tastingNotes]);

  // "Are you sure you want to exit?" when tasting is in progress
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (screen !== "tasting") return;
      // Save immediately before potential exit
      if (userName && userEmail) {
        saveSession({ name:userName, email:userEmail, optedIn, tastingNotes, savedAt:new Date().toISOString() });
      }
      e.preventDefault();
      e.returnValue = "Your tasting notes have been saved. Are you sure you want to leave?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [screen, userName, userEmail, optedIn, tastingNotes]);

  const handleStart = () => {
    if (!userName.trim() || !userEmail.includes("@")) { setError("Please enter your name and a valid email."); return; }
    const existing = loadSessions().find(s => s.email === userEmail);
    if (existing?.tastingNotes) setTastingNotes(existing.tastingNotes);
    setError(""); setScreen("tasting");
  };
  const handleFinish = () => { saveSession({name:userName,email:userEmail,optedIn,tastingNotes,savedAt:new Date().toISOString()}); setScreen("done"); };

  if (showAdmin) return <BeerSetupPanel onBack={()=>setShowAdmin(false)} />;

  /* ── WELCOME ── */
  if (screen==="welcome") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(170deg,${B.tealDark} 0%,${B.tealMid} 55%,${B.tealLight} 100%)`, fontFamily:BODY, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 20px 60px" }}>

      {/* Banner image as hero — full width, bleeds to edges */}
      <div style={{ width:"calc(100% + 40px)", maxWidth:520, marginLeft:-20, marginRight:-20, marginBottom:0 }}>
        <img src="/SH_BeerFest26_EventBrite.png" alt="Strang Hall 6th Annual Beer Fest — June 6, 2026"
          style={{ width:"100%", height:"auto", display:"block", borderRadius:"0 0 24px 24px", boxShadow:"0 12px 40px rgba(0,0,0,0.4)" }} />
      </div>

      {/* Sign-in card */}
      <div style={{ background:B.cream, borderRadius:16, padding:"26px 22px", width:"100%", maxWidth:400, marginTop:24, boxShadow:`0 8px 32px rgba(30,78,82,0.2)` }}>
        <div style={{ fontFamily:DISPLAY, fontWeight:900, fontSize:26, color:B.tealDark, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>Start Your Tasting Card</div>
        <div style={{ fontFamily:BODY, color:B.tealMid, fontSize:13, marginBottom:20, fontWeight:500 }}>Rate every pour as you go.</div>

        {[{label:"Name",type:"text",val:userName,set:setUserName,ph:"First & Last Name"},{label:"Email",type:"email",val:userEmail,set:setUserEmail,ph:"you@email.com"}].map(f=>(
          <div key={f.label} style={{ marginBottom:14 }}>
            <label style={{ fontFamily:DISPLAY, fontWeight:800, fontSize:11, letterSpacing:2, textTransform:"uppercase", color:B.tealMid, display:"block", marginBottom:5 }}>{f.label}</label>
            <input type={f.type} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
              style={{ display:"block",width:"100%",padding:"11px 14px",borderRadius:8,background:"white",border:`2px solid ${B.tealLight}`,color:B.tealDark,fontSize:14,fontFamily:BODY,outline:"none",boxSizing:"border-box",transition:"border-color 0.15s" }}
              onFocus={e=>e.target.style.borderColor=B.red} onBlur={e=>e.target.style.borderColor=B.tealLight} />
          </div>
        ))}

        <div onClick={()=>setOptedIn(!optedIn)} style={{ display:"flex",alignItems:"flex-start",gap:10,background:optedIn?B.tealPale+"88":"white",border:`2px solid ${optedIn?B.tealMid:B.tealLight}`,borderRadius:10,padding:"12px 14px",cursor:"pointer",marginBottom:18,transition:"all 0.15s" }}>
          <div style={{ width:18,height:18,borderRadius:4,flexShrink:0,marginTop:1,background:optedIn?B.tealDark:"transparent",border:`2px solid ${optedIn?B.tealDark:B.tealLight}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s" }}>
            {optedIn&&<span style={{ color:B.cream,fontSize:11,fontWeight:900 }}>✓</span>}
          </div>
          <div style={{ fontFamily:BODY,fontSize:12,color:B.tealDark,lineHeight:1.5,opacity:0.75 }}>
            Keep me in the loop on events & specials from <strong style={{ opacity:1 }}>Culinary Virtue Restaurant Collective</strong>
          </div>
        </div>

        {error&&<div style={{ color:B.red,fontSize:12,marginBottom:12,fontFamily:BODY,fontWeight:600 }}>{error}</div>}
        <button onClick={handleStart}
          style={{ width:"100%",padding:14,background:B.red,color:B.cream,border:"none",borderRadius:10,fontFamily:DISPLAY,fontWeight:900,fontSize:19,textTransform:"uppercase",letterSpacing:1.5,cursor:"pointer",boxShadow:`0 4px 20px ${B.red}55` }}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.98)"} onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
          Let's Taste 🍺
        </button>
      </div>

      <PhotoUpload uploaderName={userName} />
      <div onClick={()=>setShowAdmin(true)} style={{ fontFamily:BODY,color:"rgba(255,255,255,0.2)",fontSize:11,marginTop:28,cursor:"pointer" }}>Admin →</div>
    </div>
  );

  /* ── DONE ── */
  if (screen==="done") return (
    <div style={{ minHeight:"100vh",background:`linear-gradient(160deg,${B.tealDark} 0%,${B.tealMid} 100%)`,fontFamily:BODY,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,textAlign:"center" }}>
      <div style={{ fontSize:64,marginBottom:16 }}>🍻</div>
      <Pill>Cheers, {userName.split(" ")[0]}!</Pill>
      <div style={{ fontFamily:DISPLAY,fontWeight:900,fontSize:38,color:B.cream,textTransform:"uppercase",letterSpacing:1,marginTop:10,marginBottom:8 }}>Tasting Complete</div>
      <div style={{ fontFamily:BODY,color:B.tealLight,fontSize:14,maxWidth:300,lineHeight:1.6,marginBottom:32 }}>
        You rated <strong style={{ color:B.gold }}>{totalRated} pour{totalRated!==1?"s":""}</strong> today.
        {optedIn&&" We'll keep you posted on future Culinary Virtue events!"}
      </div>
      {(()=>{
        const top=vendors.filter(v=>Object.values(tastingNotes[v.id]?.ratings||{}).some(r=>r>=4));
        return top.length>0?(
          <div style={{ background:B.cream,borderRadius:14,padding:"18px 22px",width:"100%",maxWidth:340,marginBottom:24,textAlign:"left",boxShadow:"0 8px 32px rgba(0,0,0,0.2)" }}>
            <SectionLabel>Your Top Picks 🍺</SectionLabel>
            {top.map(v=><div key={v.id} style={{ fontFamily:DISPLAY,fontWeight:700,color:B.tealDark,fontSize:16,marginBottom:6 }}><span>🍺 </span>{v.name}</div>)}
          </div>
        ):null;
      })()}
      <div style={{ fontFamily:BODY,color:"rgba(255,255,255,0.3)",fontSize:12,marginBottom:20 }}>Notes saved · <strong style={{ color:"rgba(255,255,255,0.5)" }}>{userEmail}</strong></div>
      <button onClick={()=>setScreen("tasting")} style={{ padding:"10px 24px",background:"transparent",color:B.tealLight,border:`2px solid ${B.tealLight}55`,borderRadius:8,cursor:"pointer",fontFamily:DISPLAY,fontWeight:800,fontSize:14,textTransform:"uppercase",letterSpacing:1 }}>← Back to Notes</button>
    </div>
  );

  /* ── TASTING ── */
  return (
    <div style={{ minHeight:"100vh", background:B.tealPale, fontFamily:BODY }}>
      <div style={{ position:"sticky",top:0,zIndex:50,background:B.tealDark,borderBottom:`3px solid ${B.red}`,padding:"12px 16px" }}>
        <div style={{ maxWidth:580,margin:"0 auto" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:DISPLAY,fontWeight:800,fontSize:11,letterSpacing:3,textTransform:"uppercase",color:B.tealLight,opacity:0.65 }}>Beer Fest 2026</div>
              <div style={{ fontFamily:DISPLAY,fontWeight:900,fontSize:20,color:B.cream,textTransform:"uppercase",letterSpacing:0.5 }}>{userName.split(" ")[0]}'s Tasting Card</div>
              <div style={{ fontFamily:BODY,fontSize:10,color:B.tealLight,opacity:0.5,marginTop:2 }}>✓ Auto-saving as you go</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:DISPLAY,fontWeight:900,fontSize:28,color:B.gold }}>{totalRated}</div>
              <div style={{ fontFamily:BODY,color:B.tealLight,fontSize:10,opacity:0.6 }}>rated</div>
            </div>
          </div>
          <div style={{ display:"flex",gap:6,overflowX:"auto" }}>
            {[{key:"all",label:"All"},{key:"brewery",label:"🍺 Breweries"},{key:"distillery",label:"🥃 Spirits"},{key:"na",label:"🧃 N/A"}].map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)} style={{ padding:"5px 14px",borderRadius:6,border:"none",background:filter===f.key?B.red:"rgba(255,255,255,0.08)",color:filter===f.key?B.cream:B.tealLight,fontSize:11,fontFamily:DISPLAY,fontWeight:800,textTransform:"uppercase",letterSpacing:0.5,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0 }}>{f.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:580,margin:"0 auto",padding:"16px 14px 110px" }}>
        {filtered.map(vendor=>(
          <VendorCard key={vendor.id} vendor={vendor} beerList={beerList}
            notes={tastingNotes[vendor.id]||{}}
            onChange={notes=>setTastingNotes(prev=>({...prev,[vendor.id]:notes}))}
            isOpen={activeVendor===vendor.id}
            onToggle={()=>setActiveVendor(activeVendor===vendor.id?null:vendor.id)} />
        ))}
      </div>

      <div style={{ position:"fixed",bottom:0,left:0,right:0,background:B.tealDark,borderTop:`3px solid ${B.red}`,padding:"14px 16px" }}>
        <div style={{ maxWidth:580,margin:"0 auto" }}>
          <button onClick={handleFinish} style={{ width:"100%",padding:14,background:B.red,color:B.cream,border:"none",borderRadius:10,fontFamily:DISPLAY,fontWeight:900,fontSize:19,textTransform:"uppercase",letterSpacing:1.5,cursor:"pointer",boxShadow:`0 4px 20px ${B.red}55` }}>
            Finish & Save My Notes 🍻
          </button>
        </div>
      </div>
    </div>
  );
}
