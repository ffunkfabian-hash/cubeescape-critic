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

export const STUDIES = { waechter };
