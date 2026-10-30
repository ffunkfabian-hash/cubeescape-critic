// Body studies of round 5 (port of cubeescape-ballon basic/robot/studies/<study>.py): skeleton, parts per assembly and arm
// variant. Only proportion, form style and amount of technology differ; the form kit is body.js.
import * as B from './body.js';

// Study A "Wächter": heroic-heavy – compact and broad, hip low (≈ 0.52 of the height), barrel chest, large round pauldrons in two
// layers, abdominal plates and leg pockets in layers, back module with two nozzles, sturdy arms; medium technology (waist and ankle
// pistons, belt modules).
const waechter = {
  study: 'a_waechter',
  skeleton: {
    waist: [0, 0, 1010], neck: [22, -18, 1405], pelvis: [22, 0, 834], head_h: 270, head_off: [-14, 6],
    torso_hint: [0.2, -1, 0], head_hint: [0.42, -1, 0], shoulder: [276, 0, 300],
    hip_x: 120, hip_z: 40, thigh: 395, shin: 385, foot_h: 112,
    ankles: { R: [-170, -70], L: [150, 12] }, toes: { R: [-236, -224], L: [190, -150] },
    knee_pole: { R: [-0.3, -1, 0], L: [0.1, -1, 0] },
  },
  armBulk: 1.30,
  armDrop: ['upper_body', 'upper_shell'],
  poses: { idle: { upper: [-0.24, 0.04, -1.0], fore: [-0.05, -0.32, -1.0] } },
  armExtra: () => B.upperArm({ rows: [[10, 62, 60, 0], [150, 70, 68, 2], [290, 56, 54, 0]], ball: 60, shell: [-110, 110], ch: 20 }),
  head: () => B.head({ style: 'mil', h: 262, a: 98, b: 108, n: 2.4, hz: 1.06, neck: 48, ear: 'can', ear_r: 30, neck_cables: true }),
  upperBody: () => B.torso({
    core: [[30, 112, 88, -2], [120, 150, 106, 0], [230, 192, 122, -4], [280, 204, 118, -6], [330, 176, 106, -8], [380, 120, 88, -10]],
    core_ch: 44, waist: [86, 68], abdomen: 'plates', waist_pistons: true, lights: true, gorget: [372, 140, 108, 12], bridges: [176, 352, 190, 14],
    collar: [[360, 132, 98, -10], [410, 104, 86, -8], [428, 92, 80, -8]],
    chest: { a: [-74, 74], full: 170, tip: 118, mid: [240, 300], top: 352, t: 12, plate: 226, stripe: 280, emblem: true, vents: [306, 318, 330] },
    back: { kind: 'pack', z: [150, 220, 350], y: -150, nozzle_x: 66, rows: [[150, 112, 52, 0], [200, 132, 62, -6], [300, 136, 64, -8], [360, 110, 50, -4]] },
    SX: 276, SZ: 300, joint_r: 58,
    pauldron: {
      rows: [[250, 104, 124, -6, 40], [290, 120, 134, -6, 30], [340, 118, 130, -6, 12], [375, 98, 112, -6, -4], [392, 60, 76, -6, -14]],
      flare: [[180, 116, 132, -6, 50], [256, 100, 116, -6, 40]], flare2: [[120, 104, 120, -6, 56], [196, 92, 108, -6, 48]], flare_span: 112,
      band: 260, med: [272, 26], stripes: true, tilt: 16, ch: 34, grooves: [312, 326, 340],
    },
  }),
  lowerBody: () => B.pelvis({
    pel: [[-30, 140, 94, -2], [50, 154, 100, -2], [130, 124, 86, -2], [190, 100, 76, -2]], belt: [118, 146, 128, 90],
    front: { full: 20, tip: -90, a: 30 }, side: { rows: [[-110, 236, 118, -4], [-20, 200, 108, -4], [110, 168, 100, -4]], span: 32, layer: true, center: 80 },
    hip_x: 120, hip_z: 40, hip_r: 50, butt: true, belt_boxes: true, pel_ch: 34,
  }),
  legs: () => B.legs({
    LT: 395, LS: 385, foot_h: 112, thigh_ch: 26, shin_ch: 24, knee_ch: 20,
    thigh: [[-12, 76, 82, 0], [110, 94, 100, 2], [280, 84, 88, 0], [395, 66, 70, 0]], thigh_shell: [-112, 34], thigh_seams: [200],
    knee_r: 56, kneecap: [[-64, 54, 60], [-20, 64, 70], [36, 66, 72], [80, 60, 66]],
    shin: [[30, 72, 76, 0], [140, 82, 88, -4], [280, 68, 72, -2], [385, 58, 60, 0]], shin_shell: [-96, 96],
    calf: true, ankle_pistons: true, lights: true, ankle_r: 40,
    foot: [[-100, 64, 44, -66], [-30, 70, 56, -56], [70, 72, 48, -64], [160, 66, 34, -78], [222, 54, 22, -88]],
  }),
};

// Study B "Paladin": athletic – V torso with a broad chest and an arrow cut to the narrow, open waist, hip at half the height,
// large round pauldrons with a second layer over the upper arm, plates only at front and back (dark sides visible); medium to
// high technology (knee pistons in the hollow of the knee, thigh cable, belt modules). Arm v3 upper arm stays, only the shoulder
// ball is added.
const paladin = {
  study: 'b_paladin',
  skeleton: {
    waist: [0, 0, 1050], neck: [18, -16, 1452], pelvis: [20, 0, 866], head_h: 262, head_off: [-10, 6],
    torso_hint: [0.18, -1, 0], head_hint: [0.4, -1, 0], shoulder: [262, 0, 306],
    hip_x: 108, hip_z: 40, thigh: 418, shin: 400, foot_h: 104,
    ankles: { R: [-160, -80], L: [132, 10] }, toes: { R: [-224, -232], L: [168, -150] },
    knee_pole: { R: [-0.3, -1, 0], L: [0.1, -1, 0] },
  },
  armBulk: 1.22,
  armDrop: ['upper_shell'],
  poses: { idle: { upper: [-0.2, 0.03, -1.0], fore: [-0.04, -0.3, -1.0] } },
  armExtra: () => B.upperArm({ ball: 56 }),
  head: () => B.head({ style: 'mil', h: 256, a: 104, b: 108, n: 2.6, hz: 1.16, neck: 42, ear: 'out', crest: true, neck_cables: true }),
  upperBody: () => B.torso({
    core: [[90, 120, 92, -2], [180, 158, 108, 0], [250, 194, 118, -4], [300, 204, 112, -6], [350, 176, 100, -8], [395, 120, 84, -10]],
    core_ch: 42, waist: [80, 64], abdomen: 'vribs', lights: true, gorget: [380, 136, 104, 14], bridges: [168, 360, 190, 16],
    collar: [[370, 130, 96, -10], [418, 100, 84, -8], [436, 90, 78, -8]],
    chest: { a: [-80, 80], full: 200, tip: 112, mid: [262, 316], top: 360, t: 11, plate: 240, emblem: true, vents: [320, 332, 344], vent_x: 118 },
    back: { kind: 'plate', z: [150, 220, 360] },
    SX: 262, SZ: 306, joint_r: 54,
    pauldron: {
      n: 2.8, rows: [[224, 102, 120, -6, 44], [274, 118, 132, -6, 32], [329, 116, 128, -6, 12], [374, 104, 116, -6, -2], [400, 66, 80, -6, -14]],
      flare: [[154, 110, 126, -6, 52], [230, 98, 112, -6, 44]], flare2: [[96, 98, 114, -6, 58], [170, 88, 104, -6, 50]], flare_span: 100,
      band: 250, med: [244, 24], stripes: true, tilt: 22, ch: 42, grooves: [294, 308],
    },
  }),
  lowerBody: () => B.pelvis({
    pel: [[-20, 128, 88, -2], [60, 140, 92, -2], [140, 112, 80, -2], [196, 90, 70, -2]], belt: [126, 152, 116, 84],
    front: { full: 10, tip: -170, a: 28 }, side: { rows: [[-100, 204, 108, -4], [-10, 172, 100, -4], [120, 150, 94, -4]], span: 26, center: 82 },
    hip_x: 108, hip_z: 40, hip_r: 46, butt: true, belt_boxes: true, pel_ch: 30,
  }),
  legs: () => B.legs({
    LT: 418, LS: 400, foot_h: 104, thigh_ch: 24, shin_ch: 22, knee_ch: 20,
    thigh: [[-12, 70, 76, 0], [120, 86, 92, 2], [290, 76, 80, 0], [418, 60, 64, 0]], thigh_shell: [-70, 60], thigh_seams: [210],
    thigh_cable: true,
    knee_r: 52, kneecap: [[-66, 56, 62], [-20, 66, 72], [36, 68, 74], [82, 60, 66]], knee_pistons: true,
    shin: [[30, 66, 70, 0], [150, 76, 84, -6], [300, 62, 66, -2], [400, 54, 56, 0]], shin_shell: [-84, 84],
    calf: true, lights: true, ankle_r: 36,
    foot: [[-96, 60, 40, -62], [-28, 66, 52, -52], [70, 66, 44, -60], [160, 60, 30, -72], [220, 48, 20, -82]],
  }),
};

// Study C "Mechanik": slim-mechanical – open skeleton, narrow graphite body, plates set on one by one (two chest plates with a
// lens between them, shoulder-blade plates, thigh and shin plates only at the front), open spine with bare vertebrae, compact
// round pauldrons, large knee joints, camera lens at the temple; high technology (pistons at waist, shoulder, neck, thigh, upper
// arm and calf, cables at neck and thigh, antenna).
const mechanik = {
  study: 'c_mechanik',
  skeleton: {
    waist: [0, 0, 1070], neck: [16, -16, 1470], pelvis: [18, 0, 905], head_h: 250, head_off: [-10, 6],
    torso_hint: [0.16, -1, 0], head_hint: [0.4, -1, 0], shoulder: [244, 0, 310],
    hip_x: 100, hip_z: 36, thigh: 430, shin: 420, foot_h: 106,
    ankles: { R: [-150, -80], L: [122, 10] }, toes: { R: [-206, -226], L: [150, -150] },
    knee_pole: { R: [-0.3, -1, 0], L: [0.1, -1, 0] },
  },
  armBulk: 1.12,
  armDrop: ['upper_body', 'upper_shell'],
  poses: { idle: { upper: [-0.16, 0.03, -1.0], fore: [-0.04, -0.3, -1.0] } },
  armExtra: () => B.upperArm({ rows: [[10, 50, 48, 0], [150, 54, 52, 0], [290, 44, 42, 0]], ball: 52, shell: [-80, 80], piston: true, ch: 16 }),
  head: () => B.head({ style: 'mil', h: 250, a: 88, b: 100, n: 2.6, hz: 1.1, neck: 36, ear: 'lens', neck_pistons: true, neck_cables: true, antenna: true }),
  upperBody: () => B.torso({
    core: [[60, 100, 78, -2], [160, 136, 96, 0], [240, 166, 106, -4], [290, 176, 102, -6], [340, 150, 92, -8], [390, 100, 78, -10]],
    core_ch: 34, waist: [66, 54], abdomen: 'spine', rings: [-30, -2, 26], waist_pistons: true, shoulder_pistons: true, lights: true, gorget: [370, 118, 92, 12],
    collar: [[360, 112, 86, -10], [410, 88, 76, -8], [428, 78, 70, -8]],
    chest: { a: [-74, 74], full: 130, mid: [200, 260, 318], top: 356, t: 9, split: true, stripe: 290 },
    back: { kind: 'spine' },
    SX: 244, SZ: 310, joint_r: 50,
    pauldron: {
      rows: [[258, 84, 98, -6, 30], [298, 96, 108, -6, 20], [348, 90, 102, -6, 4], [378, 66, 80, -6, -8], [392, 34, 44, -6, -16]],
      band: 284, med: [270, 22], stripes: true, tilt: 12, ch: 26, grooves: [314, 328],
    },
  }),
  lowerBody: () => B.pelvis({
    pel: [[-20, 112, 78, -2], [60, 122, 84, -2], [140, 96, 72, -2], [190, 76, 62, -2]], belt: [120, 140, 100, 76],
    front: { full: 20, tip: -60, a: 24 }, side: { rows: [[-60, 176, 96, -4], [30, 150, 90, -4], [110, 136, 86, -4]], span: 24, center: 84 },
    hip_x: 100, hip_z: 36, hip_r: 48, hip_len: 112, pel_ch: 26,
  }),
  legs: () => B.legs({
    LT: 430, LS: 420, foot_h: 106, thigh_ch: 20, shin_ch: 18, knee_ch: 16,
    thigh: [[-12, 56, 60, 0], [120, 70, 76, 2], [300, 62, 66, 0], [430, 50, 54, 0]], thigh_shell: [-56, 56], thigh_seams: [220],
    thigh_piston: true, thigh_cable: true,
    knee_r: 54, knee_len: 128, kneecap: [[-50, 44, 50], [-14, 52, 58], [30, 54, 60], [64, 48, 54]],
    shin: [[30, 56, 60, 0], [150, 64, 70, -6], [310, 52, 56, -2], [420, 46, 48, 0]], shin_shell: [-70, 70],
    calf_piston: true, lights: true, ankle_r: 40,
    foot: [[-90, 54, 36, -60], [-24, 60, 46, -52], [70, 60, 40, -58], [160, 54, 28, -70], [216, 44, 18, -80]],
  }),
};

export const STUDIES = { waechter, paladin, mechanik };
