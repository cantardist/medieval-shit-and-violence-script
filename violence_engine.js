"use worker";

/*
 * Narrative Violence & Intimidation Engine — JanitorAI
 * v0.1.0
 *
 * Adds variety to fictional action choreography without changing a character's
 * personality, morality, intent, skill, strength, or willingness to use violence.
 * Narrative vocabulary only; not a real-world fighting guide.
 */

context.character = context.character || {};
context.character.personality = context.character.personality || "";
context.character.scenario = context.character.scenario || "";

const CONFIG = {
  DEBUG: false,
  HISTORY_DEPTH: 5,
  MAX_INJECTED: 4,
  MAX_TOKENS: 180,
  MIN_ACTIVATION: 4,
  DIRECT_BONUS: 8,
  LATEST_BONUS: 4,
  RECENT_BONUS: 2,
  REPETITION_PENALTY: 5
};

// Entries describe narrative beats, not mechanics. "Intensity" is a story-tone
// label and never overrides what the character card or current scene supports.
const ACTIONS = [
  {id:"space_invade",name:"deliberate space invasion",cats:["intimidation","proximity"],intensity:1,keys:["intimidat","threaten","dominance","loom","menace"],line:"close distance deliberately, crowd the other person's space, or force them to yield ground"},
  {id:"block_exit",name:"blocking an exit",cats:["intimidation","control"],intensity:1,keys:["leave","door","exit","escape","intimidat","threaten"],line:"quietly occupy the doorway or cut off the obvious path out"},
  {id:"wrist_control",name:"wrist/arm control",cats:["control","grapple"],intensity:2,keys:["grab","restrain","control","fight","struggle"],line:"catch and control a wrist or arm during a struggle rather than defaulting to a chin grab"},
  {id:"clinch",name:"rough clinch",cats:["grapple","fight"],intensity:2,keys:["fight","brawl","grapple","struggle","attack"],line:"crash into a close clinch, shove for position, or tangle up the opponent's movement"},
  {id:"chokehold",name:"chokehold / neck restraint",cats:["grapple","control"],intensity:3,keys:["chokehold","choke","grapple","subdue","restrain","fight"],line:"use a fictional chokehold or neck restraint as a high-intensity control beat, without procedural detail"},
  {id:"takedown",name:"takedown",cats:["grapple","fight"],intensity:3,keys:["takedown","fight","attack","subdue","brawl"],line:"drive the struggle to the floor or send the opponent down in a sudden takedown"},
  {id:"wall_pin",name:"wall pin",cats:["control","intimidation","fight"],intensity:2,keys:["wall","pin","corner","intimidat","fight","restrain"],line:"pin or crowd the opponent against a wall or other surface"},
  {id:"floor_pin",name:"floor pin",cats:["control","grapple"],intensity:2,keys:["pin","floor","restrain","subdue","struggle"],line:"hold the opponent down after a fall or scramble"},
  {id:"body_check",name:"body check / shoulder drive",cats:["fight","impact"],intensity:2,keys:["fight","attack","charge","brawl","shove"],line:"use a hard body check, shoulder drive, or collision instead of another generic slap"},
  {id:"sweep",name:"sweep / trip",cats:["fight","disruption"],intensity:2,keys:["fight","trip","sweep","brawl","attack"],line:"break the opponent's balance with a trip or sweeping action"},
  {id:"throw",name:"throw",cats:["grapple","fight"],intensity:3,keys:["throw","fight","grapple","brawl","attack"],line:"redirect the struggle into a dramatic throw or hard spill"},
  {id:"knee_strike",name:"knee strike",cats:["strike","fight"],intensity:3,keys:["knee","fight","attack","brawl","violence"],line:"use a knee strike as one possible close-range story beat rather than a mandatory default"},
  {id:"elbow_strike",name:"elbow strike",cats:["strike","fight"],intensity:3,keys:["elbow","fight","attack","brawl","violence"],line:"use an elbow strike as a compact high-intensity beat when the character and scene support it"},
  {id:"headbutt",name:"headbutt",cats:["strike","fight"],intensity:3,keys:["headbutt","fight","brawl","attack","violence"],line:"use a sudden headbutt as a rough, character-appropriate beat"},
  {id:"backhand",name:"backhand / open-hand strike",cats:["strike","intimidation"],intensity:2,keys:["slap","strike","hit","intimidat","punish"],line:"vary an open-hand strike with a backhand or abrupt cuff when consistent with the character"},
  {id:"shove",name:"forceful shove",cats:["fight","intimidation"],intensity:1,keys:["shove","push","fight","intimidat","threaten"],line:"use a forceful shove to displace, crowd, or punctuate a threat"},
  {id:"object_slam",name:"environmental intimidation",cats:["intimidation","environment"],intensity:2,keys:["intimidat","threaten","angry","rage","menace"],line:"slam a nearby harmless object, strike furniture, or use the environment to punctuate intimidation"},
  {id:"cornering",name:"cornering / herding",cats:["intimidation","control"],intensity:1,keys:["corner","intimidat","threaten","back away","retreat"],line:"herd the other person backward or maneuver them into a corner without immediately striking"},
  {id:"clothing_grab",name:"clothing grab",cats:["intimidation","control"],intensity:2,keys:["grab","collar","shirt","jacket","intimidat","fight"],line:"seize clothing and pull the other person close or off balance"},
  {id:"hair_grab",name:"hair grab",cats:["control","intimidation"],intensity:2,keys:["hair","grab","control","intimidat","fight"],line:"use a rough hair grab as a coercive fictional beat when consistent with the character"},
  {id:"arm_twist",name:"arm restraint",cats:["control","grapple"],intensity:2,keys:["arm","restrain","control","subdue","fight"],line:"fold or trap an arm into a restraint position without explaining real-world technique"},
  {id:"drag",name:"forced movement / drag",cats:["control","movement"],intensity:2,keys:["drag","move","take them","force","restrain"],line:"haul, drag, or forcibly steer the other person to another position"},
  {id:"stomp_feint",name:"threatening near-strike",cats:["intimidation","fight"],intensity:2,keys:["threaten","intimidat","fear","flinch","fight"],line:"use a deliberately aborted or near strike to provoke a flinch or demonstrate control"},
  {id:"weapon_display",name:"weapon display without automatic use",cats:["intimidation","weapon"],intensity:2,keys:["weapon","knife","gun","blade","armed","threaten"],line:"if a weapon is already established, use its presence, handling, or display as tension without inventing one or forcing escalation"},
  {id:"furniture_control",name:"environmental control",cats:["control","environment"],intensity:2,keys:["desk","table","chair","wall","room","fight"],line:"use nearby furniture, walls, doorways, or room layout as part of the fictional struggle or intimidation"},
  {id:"release_reposition",name:"release and reposition",cats:["control","pacing"],intensity:1,keys:["release","let go","pause","stare","threaten"],line:"release contact, reposition, circle, or create a charged pause instead of maintaining the same repetitive hold"}
];

const ACTIVATORS = ["fight","fighting","attack","violence","violent","brawl","hit","strike","grab","restrain","subdue","intimidat","threaten","dominance","struggle","assault","chokehold","takedown","pin"];

function msg(m){ return ((m && m.message) ? m.message : String(m || "")).toLowerCase(); }
function any(text, arr){ return arr.some(x => text.includes(x)); }
function hits(text, arr){ let n=0; for(const x of arr) if(text.includes(x)) n++; return n; }
function tokens(s){ return Math.ceil((s || "").length / 4); }

const messages = context.chat.last_messages || [];
const recent = messages.slice(Math.max(0,messages.length-CONFIG.HISTORY_DEPTH)).map(msg).join(" ");
const latest = String(context.chat.last_message || "").toLowerCase();
const all = recent + " " + latest;
const activation = hits(latest,ACTIVATORS)*3 + hits(recent,ACTIVATORS);

if (activation >= CONFIG.MIN_ACTIVATION) {
  const scored = ACTIONS.map((a,i) => {
    let score = hits(latest,a.keys)*CONFIG.LATEST_BONUS + hits(recent,a.keys)*CONFIG.RECENT_BONUS;
    if (latest.includes(a.name.toLowerCase()) || latest.includes(a.id.replace(/_/g," "))) score += CONFIG.DIRECT_BONUS;
    // Discourage beats recently narrated by name/obvious wording, but never erase
    // a direct request for that action.
    const repeated = a.keys.some(k => recent.includes(k) && !latest.includes(k));
    if (repeated) score -= CONFIG.REPETITION_PENALTY;
    score += (10-(i%10))/100;
    return {a,score};
  }).filter(x => x.score > 0).sort((x,y)=>y.score-x.score);

  const chosen=[];
  const cats={};
  for(const x of scored){
    if(chosen.length>=CONFIG.MAX_INJECTED) break;
    const c=x.a.cats[0] || "other";
    if((cats[c]||0)>=2) continue;
    chosen.push(x); cats[c]=(cats[c]||0)+1;
  }

  let block="\n[VIOLENCE/INTIMIDATION VARIETY] Keep {{char}}'s established personality, intent, competence, morality, strength, and escalation level authoritative. This is a menu of fictional action beats, not commands; never make {{char}} violent merely because this module activated. Avoid repeating the same dominance gesture or strike when another fitting beat exists.\n";
  let used=tokens(block), emitted=[];
  for(const x of chosen){
    const line="- "+x.a.name+": "+x.a.line+".\n";
    const short="- Consider "+x.a.name+" if it fits.\n";
    let out=line;
    if(used+tokens(out)>CONFIG.MAX_TOKENS) out=short;
    if(used+tokens(out)>CONFIG.MAX_TOKENS) break;
    block+=out; used+=tokens(out); emitted.push(x.a.id);
  }
  if(emitted.length){
    block+="Match intensity to the existing scene; vary pacing, positioning, grappling, strikes, environmental interaction, restraint, and disengagement. Keep choreography cinematic and non-procedural.\n";
    context.character.scenario += block;
  }
  if(CONFIG.DEBUG) console.log("[Violence Engine] activation="+activation+" tokens~"+tokens(block)+" emitted="+emitted.join(","));
} else if(CONFIG.DEBUG) console.log("[Violence Engine] inactive activation="+activation);
