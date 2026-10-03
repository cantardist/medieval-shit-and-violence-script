"use worker";

/*
 * Action Variety Engine — JanitorAI Script
 * v0.1.0
 *
 * Expands fictional confrontation/intimidation/action vocabulary without
 * changing character personality or forcing violence.
 */
context.character = context.character || {};
context.character.scenario = context.character.scenario || "";

const CONFIG = { DEBUG:false, HISTORY_DEPTH:4, MAX_ACTIONS:4, MAX_TOKENS:150, DIRECT_BONUS:8, RECENT_PENALTY:5 };

const ACTIONS = [
  {id:"loom", tags:["intimidation","dominance"], cues:["intimidat","threat","menace","domin"], text:"Use spatial pressure: close distance, block an exit, loom over someone, or force them to yield ground."},
  {id:"wall_pin", tags:["intimidation","grapple"], cues:["pin","corner","wall","grapple","fight"], text:"Consider a brief wall or furniture pin, controlling posture and space rather than defaulting to chin-grabbing."},
  {id:"wrist_control", tags:["restraint","grapple"], cues:["grab","restrain","stop","fight"], text:"Consider wrist/forearm control, redirecting an arm, or controlling both hands during a struggle."},
  {id:"clinch", tags:["grapple","fight"], cues:["fight","brawl","grapple","struggle"], text:"Use a clinch, body lock, off-balancing shove, or struggle for position when close-range fighting fits."},
  {id:"chokehold_fiction", tags:["grapple","high_intensity"], cues:["chokehold","choke","grapple","fight","subdue"], text:"For high-intensity fictional grappling, a chokehold/head-and-arm restraint can appear as a narrative beat; keep it non-instructional and avoid technical application details."},
  {id:"takedown", tags:["grapple","fight"], cues:["fight","attack","subdue","tackle"], text:"Consider a tackle, trip, sweep-like takedown, or driving someone to the floor, described cinematically rather than as technique instruction."},
  {id:"drag", tags:["control","intimidation"], cues:["drag","remove","take","captive","prisoner"], text:"Control can be shown by hauling, dragging, steering by clothing/arm, or forcing movement through the environment."},
  {id:"clothing_grab", tags:["intimidation","fight"], cues:["threat","fight","grab","angry"], text:"Consider grabbing a collar, lapel, shirtfront, belt, or coat and using it to pull the other person close or reposition them."},
  {id:"environmental", tags:["fight","improvised"], cues:["fight","brawl","violent","attack"], text:"Let the environment matter: doors, desks, walls, floors, railings, and nearby obstacles can shape the confrontation instead of every exchange being a slap or gut strike."},
  {id:"disarm", tags:["control","fight"], cues:["weapon","knife","gun","armed","fight"], text:"If the narrative establishes a weapon and the character plausibly can respond, portray a contested disarm or struggle abstractly; do not give real-world technique steps."},
  {id:"intercept", tags:["control","intimidation"], cues:["leave","escape","run","door","stop"], text:"Interception can show dominance: step into the path, catch an arm or clothing, shut/block a door, or physically cut off retreat."},
  {id:"ground_control", tags:["grapple","fight"], cues:["floor","ground","tackle","fight","subdue"], text:"After a fall, vary the beat with a pin, scramble, kneeling restraint, or fight for leverage rather than instantly resetting to standing."},
  {id:"strike_variety", tags:["fight","striking"], cues:["hit","strike","fight","punch","attack"], text:"Vary fictional strikes when appropriate: punches, elbows, knees, kicks, backhands, stomps near/at an opponent, or combinations—without anatomical targeting or optimization."},
  {id:"object_break", tags:["intimidation","display"], cues:["angry","rage","threat","intimidat"], text:"Intimidation need not touch the other person: slam a hand down, kick furniture aside, break an object, or deliberately invade personal space if it fits the character."},
  {id:"quiet_threat", tags:["intimidation","psychological"], cues:["threat","intimidat","menace","fear"], text:"Use controlled menace too: prolonged silence, deliberate proximity, blocking movement, an unbroken stare, or calmly handling an already-established prop."}
];

const TRIGGERS=["fight","fighting","violent","violence","attack","threat","intimidat","angry","rage","grab","restrain","subdue","captive","prisoner","brawl","struggle","hit","punch","choke","domin"];
function msg(m){return ((m&&m.message)?m.message:String(m||"")).toLowerCase();}
function any(t,a){return a.some(x=>t.includes(x));}
function tok(t){return Math.ceil(t.length/4);}
const ms=context.chat.last_messages||[];
const recent=ms.slice(Math.max(0,ms.length-CONFIG.HISTORY_DEPTH)).map(msg).join(" ");
const latest=String(context.chat.last_message||"").toLowerCase();
if(any(latest,TRIGGERS)||any(recent,TRIGGERS)){
  const ranked=ACTIONS.map((a,i)=>{
    let score=0;
    for(const c of a.cues){if(latest.includes(c))score+=4; else if(recent.includes(c))score+=1;}
    if(recent.includes(a.id.replace(/_/g," ")))score-=CONFIG.RECENT_PENALTY;
    score+=(10-(i%10))/100;
    return {a,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,CONFIG.MAX_ACTIONS);

  let out="\n[ACTION VARIETY] This supplements {{char}}'s existing personality and intent; never create aggression that the scene/character did not already support. Avoid repetitive dominance clichés. When confrontation is already appropriate, vary body positioning, grappling, movement, restraint, environment use, and intensity. Keep action cinematic and non-instructional.\n";
  let used=tok(out), emitted=[];
  for(const x of ranked){
    const line="- "+x.a.text+"\n";
    if(used+tok(line)>CONFIG.MAX_TOKENS)break;
    out+=line; used+=tok(line); emitted.push(x.a.id);
  }
  out+="Match force to the established character, stakes, relationship, abilities, and scene continuity; do not escalate merely for novelty.\n";
  context.character.scenario+=out;
  if(CONFIG.DEBUG)console.log("[Action Variety] tokens~"+tok(out)+" actions="+emitted.join(","));
}
