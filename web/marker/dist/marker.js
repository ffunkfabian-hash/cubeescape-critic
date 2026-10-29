var e = {
	LEFT: 0,
	MIDDLE: 1,
	RIGHT: 2,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2
}, t = {
	ROTATE: 0,
	PAN: 1,
	DOLLY_PAN: 2,
	DOLLY_ROTATE: 3
}, n = "attached", r = 1e3, i = 1001, a = 1002, o = 1003, s = 1004, c = 1005, l = 1006, u = 1007, d = 1008, f = 1009, p = 1010, m = 1011, h = 1012, g = 1013, _ = 1014, v = 1015, y = 1016, b = 1017, x = 1018, S = 1020, C = 35902, w = 35899, T = 1021, E = 1022, D = 1023, O = 1026, k = 1027, A = 1028, j = 1029, ee = 1030, te = 1031, M = 1033, ne = 33776, N = 33777, re = 33778, P = 33779, ie = 35840, ae = 35841, oe = 35842, se = 35843, ce = 36196, F = 37492, le = 37496, ue = 37488, de = 37489, fe = 37490, pe = 37491, me = 37808, he = 37809, ge = 37810, _e = 37811, ve = 37812, ye = 37813, be = 37814, xe = 37815, Se = 37816, Ce = 37817, we = 37818, Te = 37819, Ee = 37820, De = 37821, Oe = 36492, ke = 36494, Ae = 36495, je = 36283, Me = 36284, I = 36285, Ne = 36286, Pe = 2300, Fe = 2301, L = 2302, Ie = 2303, R = 2400, z = 2401, Le = 2402, Re = 2500, ze = 3200, Be = "srgb", Ve = "srgb-linear", He = "linear", Ue = "srgb", We = 7680, Ge = 35044, Ke = 2e3;
function qe(e) {
	for (let t = e.length - 1; t >= 0; --t) if (e[t] >= 65535) return !0;
	return !1;
}
function Je(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Ye(e) {
	return document.createElementNS("http://www.w3.org/1999/xhtml", e);
}
function Xe() {
	let e = Ye("canvas");
	return e.style.display = "block", e;
}
var Ze = {};
function Qe(...e) {
	let t = "THREE." + e.shift();
	console.log(t, ...e);
}
function $e(e) {
	let t = e[0];
	if (typeof t == "string" && t.startsWith("TSL:")) {
		let t = e[1];
		t && t.isStackTrace ? e[0] += " " + t.getLocation() : e[1] = "Stack trace not available. Enable \"THREE.Node.captureStackTrace\" to capture stack traces.";
	}
	return e;
}
function B(...e) {
	e = $e(e);
	let t = "THREE." + e.shift();
	{
		let n = e[0];
		n && n.isStackTrace ? console.warn(n.getError(t)) : console.warn(t, ...e);
	}
}
function V(...e) {
	e = $e(e);
	let t = "THREE." + e.shift();
	{
		let n = e[0];
		n && n.isStackTrace ? console.error(n.getError(t)) : console.error(t, ...e);
	}
}
function et(...e) {
	let t = e.join(" ");
	t in Ze || (Ze[t] = !0, B(...e));
}
function tt(e, t, n) {
	return new Promise(function(r, i) {
		function a() {
			switch (e.clientWaitSync(t, e.SYNC_FLUSH_COMMANDS_BIT, 0)) {
				case e.WAIT_FAILED:
					i();
					break;
				case e.TIMEOUT_EXPIRED:
					setTimeout(a, n);
					break;
				default: r();
			}
		}
		setTimeout(a, n);
	});
}
var nt = {
	0: 1,
	2: 6,
	4: 7,
	3: 5,
	1: 0,
	6: 2,
	7: 4,
	5: 3
}, rt = class {
	addEventListener(e, t) {
		this._listeners === void 0 && (this._listeners = {});
		let n = this._listeners;
		n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
	}
	hasEventListener(e, t) {
		let n = this._listeners;
		return n !== void 0 && n[e] !== void 0 && n[e].indexOf(t) !== -1;
	}
	removeEventListener(e, t) {
		let n = this._listeners;
		if (n === void 0) return;
		let r = n[e];
		if (r !== void 0) {
			let e = r.indexOf(t);
			e !== -1 && r.splice(e, 1);
		}
	}
	dispatchEvent(e) {
		let t = this._listeners;
		if (t === void 0) return;
		let n = t[e.type];
		if (n !== void 0) {
			e.target = this;
			let t = n.slice(0);
			for (let n = 0, r = t.length; n < r; n++) t[n].call(this, e);
			e.target = null;
		}
	}
}, it = /* @__PURE__ */ "00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff".split("."), at = 1234567, ot = Math.PI / 180, st = 180 / Math.PI;
function ct() {
	let e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0, r = Math.random() * 4294967295 | 0;
	return (it[e & 255] + it[e >> 8 & 255] + it[e >> 16 & 255] + it[e >> 24 & 255] + "-" + it[t & 255] + it[t >> 8 & 255] + "-" + it[t >> 16 & 15 | 64] + it[t >> 24 & 255] + "-" + it[n & 63 | 128] + it[n >> 8 & 255] + "-" + it[n >> 16 & 255] + it[n >> 24 & 255] + it[r & 255] + it[r >> 8 & 255] + it[r >> 16 & 255] + it[r >> 24 & 255]).toLowerCase();
}
function H(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function lt(e, t) {
	return (e % t + t) % t;
}
function ut(e, t, n, r, i) {
	return r + (e - t) * (i - r) / (n - t);
}
function dt(e, t, n) {
	return e === t ? 0 : (n - e) / (t - e);
}
function ft(e, t, n) {
	return (1 - n) * e + n * t;
}
function pt(e, t, n, r) {
	return ft(e, t, 1 - Math.exp(-n * r));
}
function mt(e, t = 1) {
	return t - Math.abs(lt(e, t * 2) - t);
}
function ht(e, t, n) {
	return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t), e * e * (3 - 2 * e));
}
function gt(e, t, n) {
	return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t), e * e * e * (e * (e * 6 - 15) + 10));
}
function _t(e, t) {
	return e + Math.floor(Math.random() * (t - e + 1));
}
function vt(e, t) {
	return e + Math.random() * (t - e);
}
function yt(e) {
	return e * (.5 - Math.random());
}
function bt(e) {
	e !== void 0 && (at = e);
	let t = at += 1831565813;
	return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function xt(e) {
	return e * ot;
}
function St(e) {
	return e * st;
}
function Ct(e) {
	return e > 0 && Number.isInteger(e) && 2 ** Math.round(Math.log2(e)) === e;
}
function wt(e) {
	return 2 ** Math.ceil(Math.log(e) / Math.LN2);
}
function Tt(e) {
	return 2 ** Math.floor(Math.log(e) / Math.LN2);
}
function Et(e, t, n, r, i) {
	let a = Math.cos, o = Math.sin, s = a(n / 2), c = o(n / 2), l = a((t + r) / 2), u = o((t + r) / 2), d = a((t - r) / 2), f = o((t - r) / 2), p = a((r - t) / 2), m = o((r - t) / 2);
	switch (i) {
		case "XYX":
			e.set(s * u, c * d, c * f, s * l);
			break;
		case "YZY":
			e.set(c * f, s * u, c * d, s * l);
			break;
		case "ZXZ":
			e.set(c * d, c * f, s * u, s * l);
			break;
		case "XZX":
			e.set(s * u, c * m, c * p, s * l);
			break;
		case "YXY":
			e.set(c * p, s * u, c * m, s * l);
			break;
		case "ZYZ":
			e.set(c * m, c * p, s * u, s * l);
			break;
		default: B("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
	}
}
function Dt(e, t) {
	switch (t.constructor) {
		case Float32Array: return e;
		case Uint32Array: return e / 4294967295;
		case Uint16Array: return e / 65535;
		case Uint8Array:
		case Uint8ClampedArray: return e / 255;
		case Int32Array: return Math.max(e / 2147483647, -1);
		case Int16Array: return Math.max(e / 32767, -1);
		case Int8Array: return Math.max(e / 127, -1);
		default: throw Error("THREE.MathUtils: Invalid component type.");
	}
}
function Ot(e, t) {
	switch (t.constructor) {
		case Float32Array: return e;
		case Uint32Array: return Math.round(e * 4294967295);
		case Uint16Array: return Math.round(e * 65535);
		case Uint8Array:
		case Uint8ClampedArray: return Math.round(e * 255);
		case Int32Array: return Math.round(e * 2147483647);
		case Int16Array: return Math.round(e * 32767);
		case Int8Array: return Math.round(e * 127);
		default: throw Error("THREE.MathUtils: Invalid component type.");
	}
}
var kt = {
	DEG2RAD: ot,
	RAD2DEG: st,
	generateUUID: ct,
	clamp: H,
	euclideanModulo: lt,
	mapLinear: ut,
	inverseLerp: dt,
	lerp: ft,
	damp: pt,
	pingpong: mt,
	smoothstep: ht,
	smootherstep: gt,
	randInt: _t,
	randFloat: vt,
	randFloatSpread: yt,
	seededRandom: bt,
	degToRad: xt,
	radToDeg: St,
	isPowerOfTwo: Ct,
	ceilPowerOfTwo: wt,
	floorPowerOfTwo: Tt,
	setQuaternionFromProperEuler: Et,
	normalize: Ot,
	denormalize: Dt
}, U = class e {
	static {
		e.prototype.isVector2 = !0;
	}
	constructor(e = 0, t = 0) {
		this.x = e, this.y = t;
	}
	get width() {
		return this.x;
	}
	set width(e) {
		this.x = e;
	}
	get height() {
		return this.y;
	}
	set height(e) {
		this.y = e;
	}
	set(e, t) {
		return this.x = e, this.y = t, this;
	}
	setScalar(e) {
		return this.x = e, this.y = e, this;
	}
	setX(e) {
		return this.x = e, this;
	}
	setY(e) {
		return this.y = e, this;
	}
	setComponent(e, t) {
		switch (e) {
			case 0:
				this.x = t;
				break;
			case 1:
				this.y = t;
				break;
			default: throw Error("THREE.Vector2: index is out of range: " + e);
		}
		return this;
	}
	getComponent(e) {
		switch (e) {
			case 0: return this.x;
			case 1: return this.y;
			default: throw Error("THREE.Vector2: index is out of range: " + e);
		}
	}
	clone() {
		return new this.constructor(this.x, this.y);
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this;
	}
	addScalar(e) {
		return this.x += e, this.y += e, this;
	}
	addVectors(e, t) {
		return this.x = e.x + t.x, this.y = e.y + t.y, this;
	}
	addScaledVector(e, t) {
		return this.x += e.x * t, this.y += e.y * t, this;
	}
	sub(e) {
		return this.x -= e.x, this.y -= e.y, this;
	}
	subScalar(e) {
		return this.x -= e, this.y -= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this;
	}
	multiply(e) {
		return this.x *= e.x, this.y *= e.y, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this;
	}
	divide(e) {
		return this.x /= e.x, this.y /= e.y, this;
	}
	divideScalar(e) {
		return this.multiplyScalar(1 / e);
	}
	applyMatrix3(e) {
		let t = this.x, n = this.y, r = e.elements;
		return this.x = r[0] * t + r[3] * n + r[6], this.y = r[1] * t + r[4] * n + r[7], this;
	}
	min(e) {
		return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
	}
	max(e) {
		return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
	}
	clamp(e, t) {
		return this.x = H(this.x, e.x, t.x), this.y = H(this.y, e.y, t.y), this;
	}
	clampScalar(e, t) {
		return this.x = H(this.x, e, t), this.y = H(this.y, e, t), this;
	}
	clampLength(e, t) {
		let n = this.length();
		return this.divideScalar(n || 1).multiplyScalar(H(n, e, t));
	}
	floor() {
		return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
	}
	ceil() {
		return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
	}
	round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
	}
	roundToZero() {
		return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
	}
	negate() {
		return this.x = -this.x, this.y = -this.y, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y;
	}
	cross(e) {
		return this.x * e.y - this.y * e.x;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y);
	}
	normalize() {
		return this.divideScalar(this.length() || 1);
	}
	angle() {
		return Math.atan2(-this.y, -this.x) + Math.PI;
	}
	angleTo(e) {
		let t = Math.sqrt(this.lengthSq() * e.lengthSq());
		if (t === 0) return Math.PI / 2;
		let n = this.dot(e) / t;
		return Math.acos(H(n, -1, 1));
	}
	distanceTo(e) {
		return Math.sqrt(this.distanceToSquared(e));
	}
	distanceToSquared(e) {
		let t = this.x - e.x, n = this.y - e.y;
		return t * t + n * n;
	}
	manhattanDistanceTo(e) {
		return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
	}
	setLength(e) {
		return this.normalize().multiplyScalar(e);
	}
	lerp(e, t) {
		return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
	}
	lerpVectors(e, t, n) {
		return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
	}
	equals(e) {
		return e.x === this.x && e.y === this.y;
	}
	fromArray(e, t = 0) {
		return this.x = e[t], this.y = e[t + 1], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.x, e[t + 1] = this.y, e;
	}
	fromBufferAttribute(e, t) {
		return this.x = e.getX(t), this.y = e.getY(t), this;
	}
	rotateAround(e, t) {
		let n = Math.cos(t), r = Math.sin(t), i = this.x - e.x, a = this.y - e.y;
		return this.x = i * n - a * r + e.x, this.y = i * r + a * n + e.y, this;
	}
	random() {
		return this.x = Math.random(), this.y = Math.random(), this;
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y;
	}
}, At = class {
	constructor(e = 0, t = 0, n = 0, r = 1) {
		this.isQuaternion = !0, this._x = e, this._y = t, this._z = n, this._w = r;
	}
	static slerpFlat(e, t, n, r, i, a, o) {
		let s = n[r + 0], c = n[r + 1], l = n[r + 2], u = n[r + 3], d = i[a + 0], f = i[a + 1], p = i[a + 2], m = i[a + 3];
		if (u !== m || s !== d || c !== f || l !== p) {
			let e = s * d + c * f + l * p + u * m;
			e < 0 && (d = -d, f = -f, p = -p, m = -m, e = -e);
			let t = 1 - o;
			if (e < .9995) {
				let n = Math.acos(e), r = Math.sin(n);
				t = Math.sin(t * n) / r, o = Math.sin(o * n) / r, s = s * t + d * o, c = c * t + f * o, l = l * t + p * o, u = u * t + m * o;
			} else {
				s = s * t + d * o, c = c * t + f * o, l = l * t + p * o, u = u * t + m * o;
				let e = 1 / Math.sqrt(s * s + c * c + l * l + u * u);
				s *= e, c *= e, l *= e, u *= e;
			}
		}
		e[t] = s, e[t + 1] = c, e[t + 2] = l, e[t + 3] = u;
	}
	static multiplyQuaternionsFlat(e, t, n, r, i, a) {
		let o = n[r], s = n[r + 1], c = n[r + 2], l = n[r + 3], u = i[a], d = i[a + 1], f = i[a + 2], p = i[a + 3];
		return e[t] = o * p + l * u + s * f - c * d, e[t + 1] = s * p + l * d + c * u - o * f, e[t + 2] = c * p + l * f + o * d - s * u, e[t + 3] = l * p - o * u - s * d - c * f, e;
	}
	get x() {
		return this._x;
	}
	set x(e) {
		this._x = e, this._onChangeCallback();
	}
	get y() {
		return this._y;
	}
	set y(e) {
		this._y = e, this._onChangeCallback();
	}
	get z() {
		return this._z;
	}
	set z(e) {
		this._z = e, this._onChangeCallback();
	}
	get w() {
		return this._w;
	}
	set w(e) {
		this._w = e, this._onChangeCallback();
	}
	set(e, t, n, r) {
		return this._x = e, this._y = t, this._z = n, this._w = r, this._onChangeCallback(), this;
	}
	clone() {
		return new this.constructor(this._x, this._y, this._z, this._w);
	}
	copy(e) {
		return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
	}
	setFromEuler(e, t = !0) {
		let n = e._x, r = e._y, i = e._z, a = e._order, o = Math.cos, s = Math.sin, c = o(n / 2), l = o(r / 2), u = o(i / 2), d = s(n / 2), f = s(r / 2), p = s(i / 2);
		switch (a) {
			case "XYZ":
				this._x = d * l * u + c * f * p, this._y = c * f * u - d * l * p, this._z = c * l * p + d * f * u, this._w = c * l * u - d * f * p;
				break;
			case "YXZ":
				this._x = d * l * u + c * f * p, this._y = c * f * u - d * l * p, this._z = c * l * p - d * f * u, this._w = c * l * u + d * f * p;
				break;
			case "ZXY":
				this._x = d * l * u - c * f * p, this._y = c * f * u + d * l * p, this._z = c * l * p + d * f * u, this._w = c * l * u - d * f * p;
				break;
			case "ZYX":
				this._x = d * l * u - c * f * p, this._y = c * f * u + d * l * p, this._z = c * l * p - d * f * u, this._w = c * l * u + d * f * p;
				break;
			case "YZX":
				this._x = d * l * u + c * f * p, this._y = c * f * u + d * l * p, this._z = c * l * p - d * f * u, this._w = c * l * u - d * f * p;
				break;
			case "XZY":
				this._x = d * l * u - c * f * p, this._y = c * f * u - d * l * p, this._z = c * l * p + d * f * u, this._w = c * l * u + d * f * p;
				break;
			default: B("Quaternion: .setFromEuler() encountered an unknown order: " + a);
		}
		return t === !0 && this._onChangeCallback(), this;
	}
	setFromAxisAngle(e, t) {
		let n = t / 2, r = Math.sin(n);
		return this._x = e.x * r, this._y = e.y * r, this._z = e.z * r, this._w = Math.cos(n), this._onChangeCallback(), this;
	}
	setFromRotationMatrix(e) {
		let t = e.elements, n = t[0], r = t[4], i = t[8], a = t[1], o = t[5], s = t[9], c = t[2], l = t[6], u = t[10], d = n + o + u;
		if (d > 0) {
			let e = .5 / Math.sqrt(d + 1);
			this._w = .25 / e, this._x = (l - s) * e, this._y = (i - c) * e, this._z = (a - r) * e;
		} else if (n > o && n > u) {
			let e = 2 * Math.sqrt(1 + n - o - u);
			this._w = (l - s) / e, this._x = .25 * e, this._y = (r + a) / e, this._z = (i + c) / e;
		} else if (o > u) {
			let e = 2 * Math.sqrt(1 + o - n - u);
			this._w = (i - c) / e, this._x = (r + a) / e, this._y = .25 * e, this._z = (s + l) / e;
		} else {
			let e = 2 * Math.sqrt(1 + u - n - o);
			this._w = (a - r) / e, this._x = (i + c) / e, this._y = (s + l) / e, this._z = .25 * e;
		}
		return this._onChangeCallback(), this;
	}
	setFromUnitVectors(e, t) {
		let n = e.dot(t) + 1;
		return n < 1e-8 ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
	}
	angleTo(e) {
		return 2 * Math.acos(Math.abs(H(this.dot(e), -1, 1)));
	}
	rotateTowards(e, t) {
		let n = this.angleTo(e);
		if (n === 0) return this;
		let r = Math.min(1, t / n);
		return this.slerp(e, r), this;
	}
	identity() {
		return this.set(0, 0, 0, 1);
	}
	invert() {
		return this.conjugate();
	}
	conjugate() {
		return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
	}
	dot(e) {
		return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
	}
	lengthSq() {
		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	}
	length() {
		return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	}
	normalize() {
		let e = this.length();
		return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x *= e, this._y *= e, this._z *= e, this._w *= e), this._onChangeCallback(), this;
	}
	multiply(e) {
		return this.multiplyQuaternions(this, e);
	}
	premultiply(e) {
		return this.multiplyQuaternions(e, this);
	}
	multiplyQuaternions(e, t) {
		let n = e._x, r = e._y, i = e._z, a = e._w, o = t._x, s = t._y, c = t._z, l = t._w;
		return this._x = n * l + a * o + r * c - i * s, this._y = r * l + a * s + i * o - n * c, this._z = i * l + a * c + n * s - r * o, this._w = a * l - n * o - r * s - i * c, this._onChangeCallback(), this;
	}
	slerp(e, t) {
		let n = e._x, r = e._y, i = e._z, a = e._w, o = this.dot(e);
		o < 0 && (n = -n, r = -r, i = -i, a = -a, o = -o);
		let s = 1 - t;
		if (o < .9995) {
			let e = Math.acos(o), c = Math.sin(e);
			s = Math.sin(s * e) / c, t = Math.sin(t * e) / c, this._x = this._x * s + n * t, this._y = this._y * s + r * t, this._z = this._z * s + i * t, this._w = this._w * s + a * t, this._onChangeCallback();
		} else this._x = this._x * s + n * t, this._y = this._y * s + r * t, this._z = this._z * s + i * t, this._w = this._w * s + a * t, this.normalize();
		return this;
	}
	slerpQuaternions(e, t, n) {
		return this.copy(e).slerp(t, n);
	}
	random() {
		let e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), r = Math.sqrt(1 - n), i = Math.sqrt(n);
		return this.set(r * Math.sin(e), r * Math.cos(e), i * Math.sin(t), i * Math.cos(t));
	}
	equals(e) {
		return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
	}
	fromArray(e, t = 0) {
		return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
	}
	fromBufferAttribute(e, t) {
		return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
	}
	toJSON() {
		return this.toArray();
	}
	_onChange(e) {
		return this._onChangeCallback = e, this;
	}
	_onChangeCallback() {}
	*[Symbol.iterator]() {
		yield this._x, yield this._y, yield this._z, yield this._w;
	}
}, W = class e {
	static {
		e.prototype.isVector3 = !0;
	}
	constructor(e = 0, t = 0, n = 0) {
		this.x = e, this.y = t, this.z = n;
	}
	set(e, t, n) {
		return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
	}
	setScalar(e) {
		return this.x = e, this.y = e, this.z = e, this;
	}
	setX(e) {
		return this.x = e, this;
	}
	setY(e) {
		return this.y = e, this;
	}
	setZ(e) {
		return this.z = e, this;
	}
	setComponent(e, t) {
		switch (e) {
			case 0:
				this.x = t;
				break;
			case 1:
				this.y = t;
				break;
			case 2:
				this.z = t;
				break;
			default: throw Error("THREE.Vector3: index is out of range: " + e);
		}
		return this;
	}
	getComponent(e) {
		switch (e) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw Error("THREE.Vector3: index is out of range: " + e);
		}
	}
	clone() {
		return new this.constructor(this.x, this.y, this.z);
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this.z = e.z, this;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this.z += e.z, this;
	}
	addScalar(e) {
		return this.x += e, this.y += e, this.z += e, this;
	}
	addVectors(e, t) {
		return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
	}
	addScaledVector(e, t) {
		return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
	}
	sub(e) {
		return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
	}
	subScalar(e) {
		return this.x -= e, this.y -= e, this.z -= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
	}
	multiply(e) {
		return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this.z *= e, this;
	}
	multiplyVectors(e, t) {
		return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
	}
	applyEuler(e) {
		return this.applyQuaternion(Mt.setFromEuler(e));
	}
	applyAxisAngle(e, t) {
		return this.applyQuaternion(Mt.setFromAxisAngle(e, t));
	}
	applyMatrix3(e) {
		let t = this.x, n = this.y, r = this.z, i = e.elements;
		return this.x = i[0] * t + i[3] * n + i[6] * r, this.y = i[1] * t + i[4] * n + i[7] * r, this.z = i[2] * t + i[5] * n + i[8] * r, this;
	}
	applyNormalMatrix(e) {
		return this.applyMatrix3(e).normalize();
	}
	applyMatrix4(e) {
		let t = this.x, n = this.y, r = this.z, i = e.elements, a = 1 / (i[3] * t + i[7] * n + i[11] * r + i[15]);
		return this.x = (i[0] * t + i[4] * n + i[8] * r + i[12]) * a, this.y = (i[1] * t + i[5] * n + i[9] * r + i[13]) * a, this.z = (i[2] * t + i[6] * n + i[10] * r + i[14]) * a, this;
	}
	applyQuaternion(e) {
		let t = this.x, n = this.y, r = this.z, i = e.x, a = e.y, o = e.z, s = e.w, c = 2 * (a * r - o * n), l = 2 * (o * t - i * r), u = 2 * (i * n - a * t);
		return this.x = t + s * c + a * u - o * l, this.y = n + s * l + o * c - i * u, this.z = r + s * u + i * l - a * c, this;
	}
	project(e) {
		return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
	}
	unproject(e) {
		return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
	}
	transformDirection(e) {
		let t = this.x, n = this.y, r = this.z, i = e.elements;
		return this.x = i[0] * t + i[4] * n + i[8] * r, this.y = i[1] * t + i[5] * n + i[9] * r, this.z = i[2] * t + i[6] * n + i[10] * r, this.normalize();
	}
	divide(e) {
		return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
	}
	divideScalar(e) {
		return this.multiplyScalar(1 / e);
	}
	min(e) {
		return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
	}
	max(e) {
		return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
	}
	clamp(e, t) {
		return this.x = H(this.x, e.x, t.x), this.y = H(this.y, e.y, t.y), this.z = H(this.z, e.z, t.z), this;
	}
	clampScalar(e, t) {
		return this.x = H(this.x, e, t), this.y = H(this.y, e, t), this.z = H(this.z, e, t), this;
	}
	clampLength(e, t) {
		let n = this.length();
		return this.divideScalar(n || 1).multiplyScalar(H(n, e, t));
	}
	floor() {
		return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
	}
	ceil() {
		return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
	}
	round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
	}
	roundToZero() {
		return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
	}
	negate() {
		return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y + this.z * e.z;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}
	normalize() {
		return this.divideScalar(this.length() || 1);
	}
	setLength(e) {
		return this.normalize().multiplyScalar(e);
	}
	lerp(e, t) {
		return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
	}
	lerpVectors(e, t, n) {
		return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
	}
	cross(e) {
		return this.crossVectors(this, e);
	}
	crossVectors(e, t) {
		let n = e.x, r = e.y, i = e.z, a = t.x, o = t.y, s = t.z;
		return this.x = r * s - i * o, this.y = i * a - n * s, this.z = n * o - r * a, this;
	}
	projectOnVector(e) {
		let t = e.lengthSq();
		if (t === 0) return this.set(0, 0, 0);
		let n = e.dot(this) / t;
		return this.copy(e).multiplyScalar(n);
	}
	projectOnPlane(e) {
		return jt.copy(this).projectOnVector(e), this.sub(jt);
	}
	reflect(e) {
		return this.sub(jt.copy(e).multiplyScalar(2 * this.dot(e)));
	}
	angleTo(e) {
		let t = Math.sqrt(this.lengthSq() * e.lengthSq());
		if (t === 0) return Math.PI / 2;
		let n = this.dot(e) / t;
		return Math.acos(H(n, -1, 1));
	}
	distanceTo(e) {
		return Math.sqrt(this.distanceToSquared(e));
	}
	distanceToSquared(e) {
		let t = this.x - e.x, n = this.y - e.y, r = this.z - e.z;
		return t * t + n * n + r * r;
	}
	manhattanDistanceTo(e) {
		return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
	}
	setFromSpherical(e) {
		return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
	}
	setFromSphericalCoords(e, t, n) {
		let r = Math.sin(t) * e;
		return this.x = r * Math.sin(n), this.y = Math.cos(t) * e, this.z = r * Math.cos(n), this;
	}
	setFromCylindrical(e) {
		return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
	}
	setFromCylindricalCoords(e, t, n) {
		return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
	}
	setFromMatrixPosition(e) {
		let t = e.elements;
		return this.x = t[12], this.y = t[13], this.z = t[14], this;
	}
	setFromMatrixScale(e) {
		let t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), r = this.setFromMatrixColumn(e, 2).length();
		return this.x = t, this.y = n, this.z = r, this;
	}
	setFromMatrixColumn(e, t) {
		return this.fromArray(e.elements, t * 4);
	}
	setFromMatrix3Column(e, t) {
		return this.fromArray(e.elements, t * 3);
	}
	setFromEuler(e) {
		return this.x = e._x, this.y = e._y, this.z = e._z, this;
	}
	setFromColor(e) {
		return this.x = e.r, this.y = e.g, this.z = e.b, this;
	}
	equals(e) {
		return e.x === this.x && e.y === this.y && e.z === this.z;
	}
	fromArray(e, t = 0) {
		return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
	}
	fromBufferAttribute(e, t) {
		return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
	}
	random() {
		return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
	}
	randomDirection() {
		let e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
		return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y, yield this.z;
	}
}, jt = /*@__PURE__*/ new W(), Mt = /*@__PURE__*/ new At(), G = class e {
	static {
		e.prototype.isMatrix3 = !0;
	}
	constructor(e, t, n, r, i, a, o, s, c) {
		this.elements = [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		], e !== void 0 && this.set(e, t, n, r, i, a, o, s, c);
	}
	set(e, t, n, r, i, a, o, s, c) {
		let l = this.elements;
		return l[0] = e, l[1] = r, l[2] = o, l[3] = t, l[4] = i, l[5] = s, l[6] = n, l[7] = a, l[8] = c, this;
	}
	identity() {
		return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
	}
	copy(e) {
		let t = this.elements, n = e.elements;
		return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
	}
	extractBasis(e, t, n) {
		return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
	}
	setFromMatrix4(e) {
		let t = e.elements;
		return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
	}
	multiply(e) {
		return this.multiplyMatrices(this, e);
	}
	premultiply(e) {
		return this.multiplyMatrices(e, this);
	}
	multiplyMatrices(e, t) {
		let n = e.elements, r = t.elements, i = this.elements, a = n[0], o = n[3], s = n[6], c = n[1], l = n[4], u = n[7], d = n[2], f = n[5], p = n[8], m = r[0], h = r[3], g = r[6], _ = r[1], v = r[4], y = r[7], b = r[2], x = r[5], S = r[8];
		return i[0] = a * m + o * _ + s * b, i[3] = a * h + o * v + s * x, i[6] = a * g + o * y + s * S, i[1] = c * m + l * _ + u * b, i[4] = c * h + l * v + u * x, i[7] = c * g + l * y + u * S, i[2] = d * m + f * _ + p * b, i[5] = d * h + f * v + p * x, i[8] = d * g + f * y + p * S, this;
	}
	multiplyScalar(e) {
		let t = this.elements;
		return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
	}
	determinant() {
		let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8];
		return t * a * l - t * o * c - n * i * l + n * o * s + r * i * c - r * a * s;
	}
	invert() {
		let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = l * a - o * c, d = o * s - l * i, f = c * i - a * s, p = t * u + n * d + r * f;
		if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
		let m = 1 / p;
		return e[0] = u * m, e[1] = (r * c - l * n) * m, e[2] = (o * n - r * a) * m, e[3] = d * m, e[4] = (l * t - r * s) * m, e[5] = (r * i - o * t) * m, e[6] = f * m, e[7] = (n * s - c * t) * m, e[8] = (a * t - n * i) * m, this;
	}
	transpose() {
		let e, t = this.elements;
		return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
	}
	getNormalMatrix(e) {
		return this.setFromMatrix4(e).invert().transpose();
	}
	transposeIntoArray(e) {
		let t = this.elements;
		return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
	}
	setUvTransform(e, t, n, r, i, a, o) {
		let s = Math.cos(i), c = Math.sin(i);
		return this.set(n * s, n * c, -n * (s * a + c * o) + a + e, -r * c, r * s, -r * (-c * a + s * o) + o + t, 0, 0, 1), this;
	}
	scale(e, t) {
		return et("Matrix3: .scale() is deprecated. Use .makeScale() instead."), this.premultiply(Nt.makeScale(e, t)), this;
	}
	rotate(e) {
		return et("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."), this.premultiply(Nt.makeRotation(-e)), this;
	}
	translate(e, t) {
		return et("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."), this.premultiply(Nt.makeTranslation(e, t)), this;
	}
	makeTranslation(e, t) {
		return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
	}
	makeRotation(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(t, -n, 0, n, t, 0, 0, 0, 1), this;
	}
	makeScale(e, t) {
		return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
	}
	equals(e) {
		let t = this.elements, n = e.elements;
		for (let e = 0; e < 9; e++) if (t[e] !== n[e]) return !1;
		return !0;
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
		return this;
	}
	toArray(e = [], t = 0) {
		let n = this.elements;
		return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
	}
	clone() {
		return new this.constructor().fromArray(this.elements);
	}
}, Nt = /*@__PURE__*/ new G(), Pt = /*@__PURE__*/ new G().set(.4123908, .3575843, .1804808, .212639, .7151687, .0721923, .0193308, .1191948, .9505322), Ft = /*@__PURE__*/ new G().set(3.2409699, -1.5373832, -.4986108, -.9692436, 1.8759675, .0415551, .0556301, -.203977, 1.0569715);
function It() {
	let e = {
		enabled: !0,
		workingColorSpace: Ve,
		spaces: {},
		convert: function(e, t, n) {
			return this.enabled === !1 || t === n || !t || !n || (this.spaces[t].transfer === "srgb" && (e.r = Lt(e.r), e.g = Lt(e.g), e.b = Lt(e.b)), this.spaces[t].primaries !== this.spaces[n].primaries && (e.applyMatrix3(this.spaces[t].toXYZ), e.applyMatrix3(this.spaces[n].fromXYZ)), this.spaces[n].transfer === "srgb" && (e.r = Rt(e.r), e.g = Rt(e.g), e.b = Rt(e.b))), e;
		},
		workingToColorSpace: function(e, t) {
			return this.convert(e, this.workingColorSpace, t);
		},
		colorSpaceToWorking: function(e, t) {
			return this.convert(e, t, this.workingColorSpace);
		},
		getPrimaries: function(e) {
			return this.spaces[e].primaries;
		},
		getTransfer: function(e) {
			return e === "" ? He : this.spaces[e].transfer;
		},
		getToneMappingMode: function(e) {
			return this.spaces[e].outputColorSpaceConfig.toneMappingMode || "standard";
		},
		getLuminanceCoefficients: function(e, t = this.workingColorSpace) {
			return e.fromArray(this.spaces[t].luminanceCoefficients);
		},
		define: function(e) {
			Object.assign(this.spaces, e);
		},
		_getMatrix: function(e, t, n) {
			return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ);
		},
		_getDrawingBufferColorSpace: function(e) {
			return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace;
		},
		_getUnpackColorSpace: function(e = this.workingColorSpace) {
			return this.spaces[e].workingColorSpaceConfig.unpackColorSpace;
		},
		fromWorkingColorSpace: function(t, n) {
			return et("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), e.workingToColorSpace(t, n);
		},
		toWorkingColorSpace: function(t, n) {
			return et("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), e.colorSpaceToWorking(t, n);
		}
	}, t = [
		.64,
		.33,
		.3,
		.6,
		.15,
		.06
	], n = [
		.2126,
		.7152,
		.0722
	], r = [.3127, .329];
	return e.define({
		[Ve]: {
			primaries: t,
			whitePoint: r,
			transfer: He,
			toXYZ: Pt,
			fromXYZ: Ft,
			luminanceCoefficients: n,
			workingColorSpaceConfig: { unpackColorSpace: Be },
			outputColorSpaceConfig: { drawingBufferColorSpace: Be }
		},
		[Be]: {
			primaries: t,
			whitePoint: r,
			transfer: Ue,
			toXYZ: Pt,
			fromXYZ: Ft,
			luminanceCoefficients: n,
			outputColorSpaceConfig: { drawingBufferColorSpace: Be }
		}
	}), e;
}
var K = /*@__PURE__*/ It();
function Lt(e) {
	return e < .04045 ? e * .0773993808 : (e * .9478672986 + .0521327014) ** 2.4;
}
function Rt(e) {
	return e < .0031308 ? e * 12.92 : 1.055 * e ** .41666 - .055;
}
var zt, Bt = class {
	static getDataURL(e, t = "image/png") {
		if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
		let n;
		if (e instanceof HTMLCanvasElement) n = e;
		else {
			zt === void 0 && (zt = Ye("canvas")), zt.width = e.width, zt.height = e.height;
			let t = zt.getContext("2d");
			e instanceof ImageData ? t.putImageData(e, 0, 0) : t.drawImage(e, 0, 0, e.width, e.height), n = zt;
		}
		return n.toDataURL(t);
	}
	static sRGBToLinear(e) {
		if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
			let t = Ye("canvas");
			t.width = e.width, t.height = e.height;
			let n = t.getContext("2d");
			n.drawImage(e, 0, 0, e.width, e.height);
			let r = n.getImageData(0, 0, e.width, e.height), i = r.data;
			for (let e = 0; e < i.length; e++) i[e] = Lt(i[e] / 255) * 255;
			return n.putImageData(r, 0, 0), t;
		}
		if (e.data) {
			let t = e.data.slice(0);
			for (let e = 0; e < t.length; e++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[e] = Math.floor(Lt(t[e] / 255) * 255) : t[e] = Lt(t[e]);
			return {
				data: t,
				width: e.width,
				height: e.height
			};
		}
		return B("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
	}
}, Vt = 0, Ht = class {
	constructor(e = null) {
		this.isTextureSource = !0, Object.defineProperty(this, "id", { value: Vt++ }), this.uuid = ct(), this.data = e, this.dataReady = !0, this.version = 0;
	}
	getSize(e) {
		let t = this.data;
		return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : typeof VideoFrame < "u" && t instanceof VideoFrame ? e.set(t.displayWidth, t.displayHeight, 0) : t === null ? e.set(0, 0, 0) : e.set(t.width, t.height, t.depth || 0), e;
	}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string";
		if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
		let n = {
			uuid: this.uuid,
			url: ""
		}, r = this.data;
		if (r !== null) {
			let e;
			if (Array.isArray(r)) {
				e = [];
				for (let t = 0, n = r.length; t < n; t++) r[t].isDataTexture ? e.push(Ut(r[t].image)) : e.push(Ut(r[t]));
			} else e = Ut(r);
			n.url = e;
		}
		return t || (e.images[this.uuid] = n), n;
	}
};
function Ut(e) {
	return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap ? Bt.getDataURL(e) : e.data ? {
		data: Array.from(e.data),
		width: e.width,
		height: e.height,
		type: e.data.constructor.name
	} : (B("Texture: Unable to serialize Texture."), {});
}
var Wt = 0, Gt = /*@__PURE__*/ new W(), Kt = class e extends rt {
	constructor(t = e.DEFAULT_IMAGE, n = e.DEFAULT_MAPPING, r = i, a = i, o = l, s = d, c = D, u = f, p = e.DEFAULT_ANISOTROPY, m = "") {
		super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Wt++ }), this.uuid = ct(), this.name = "", this.source = new Ht(t), this.mipmaps = [], this.mapping = n, this.channel = 0, this.wrapS = r, this.wrapT = a, this.magFilter = o, this.minFilter = s, this.anisotropy = p, this.format = c, this.internalFormat = null, this.type = u, this.offset = new U(0, 0), this.repeat = new U(1, 1), this.center = new U(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new G(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = m, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isArrayTexture = !!(t && t.depth && t.depth > 1), this.pmremVersion = 0, this.normalized = !1;
	}
	get width() {
		return this.source.getSize(Gt).x;
	}
	get height() {
		return this.source.getSize(Gt).y;
	}
	get depth() {
		return this.source.getSize(Gt).z;
	}
	get image() {
		return this.source.data;
	}
	set image(e) {
		this.source.data = e;
	}
	updateMatrix() {
		this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
	}
	addUpdateRange(e, t) {
		this.updateRanges.push({
			start: e,
			count: t
		});
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.normalized = e.normalized, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
	}
	setValues(e) {
		for (let t in e) {
			let n = e[t];
			if (n === void 0) {
				B(`Texture.setValues(): parameter '${t}' has value of undefined.`);
				continue;
			}
			let r = this[t];
			r === void 0 ? B(`Texture.setValues(): property '${t}' does not exist.`) : r && n && r.isVector2 && n.isVector2 || r && n && r.isVector3 && n.isVector3 || r && n && r.isMatrix3 && n.isMatrix3 ? r.copy(n) : this[t] = n;
		}
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string";
		if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
		let n = {
			metadata: {
				version: 4.7,
				type: "Texture",
				generator: "Texture.toJSON"
			},
			uuid: this.uuid,
			name: this.name,
			image: this.source.toJSON(e).uuid,
			mapping: this.mapping,
			channel: this.channel,
			repeat: [this.repeat.x, this.repeat.y],
			offset: [this.offset.x, this.offset.y],
			center: [this.center.x, this.center.y],
			rotation: this.rotation,
			wrap: [this.wrapS, this.wrapT],
			format: this.format,
			internalFormat: this.internalFormat,
			type: this.type,
			normalized: this.normalized,
			colorSpace: this.colorSpace,
			minFilter: this.minFilter,
			magFilter: this.magFilter,
			anisotropy: this.anisotropy,
			flipY: this.flipY,
			generateMipmaps: this.generateMipmaps,
			premultiplyAlpha: this.premultiplyAlpha,
			unpackAlignment: this.unpackAlignment
		};
		return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
	transformUv(e) {
		if (this.mapping !== 300) return e;
		if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1) switch (this.wrapS) {
			case r:
				e.x -= Math.floor(e.x);
				break;
			case i:
				e.x = e.x < 0 ? 0 : 1;
				break;
			case a: Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x -= Math.floor(e.x);
		}
		if (e.y < 0 || e.y > 1) switch (this.wrapT) {
			case r:
				e.y -= Math.floor(e.y);
				break;
			case i:
				e.y = e.y < 0 ? 0 : 1;
				break;
			case a: Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y -= Math.floor(e.y);
		}
		return this.flipY && (e.y = 1 - e.y), e;
	}
	set needsUpdate(e) {
		e === !0 && (this.version++, this.source.needsUpdate = !0);
	}
	set needsPMREMUpdate(e) {
		e === !0 && this.pmremVersion++;
	}
};
Kt.DEFAULT_IMAGE = null, Kt.DEFAULT_MAPPING = 300, Kt.DEFAULT_ANISOTROPY = 1;
var qt = class e {
	static {
		e.prototype.isVector4 = !0;
	}
	constructor(e = 0, t = 0, n = 0, r = 1) {
		this.x = e, this.y = t, this.z = n, this.w = r;
	}
	get width() {
		return this.z;
	}
	set width(e) {
		this.z = e;
	}
	get height() {
		return this.w;
	}
	set height(e) {
		this.w = e;
	}
	set(e, t, n, r) {
		return this.x = e, this.y = t, this.z = n, this.w = r, this;
	}
	setScalar(e) {
		return this.x = e, this.y = e, this.z = e, this.w = e, this;
	}
	setX(e) {
		return this.x = e, this;
	}
	setY(e) {
		return this.y = e, this;
	}
	setZ(e) {
		return this.z = e, this;
	}
	setW(e) {
		return this.w = e, this;
	}
	setComponent(e, t) {
		switch (e) {
			case 0:
				this.x = t;
				break;
			case 1:
				this.y = t;
				break;
			case 2:
				this.z = t;
				break;
			case 3:
				this.w = t;
				break;
			default: throw Error("THREE.Vector4: index is out of range: " + e);
		}
		return this;
	}
	getComponent(e) {
		switch (e) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw Error("THREE.Vector4: index is out of range: " + e);
		}
	}
	clone() {
		return new this.constructor(this.x, this.y, this.z, this.w);
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w === void 0 ? 1 : e.w, this;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
	}
	addScalar(e) {
		return this.x += e, this.y += e, this.z += e, this.w += e, this;
	}
	addVectors(e, t) {
		return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
	}
	addScaledVector(e, t) {
		return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
	}
	sub(e) {
		return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
	}
	subScalar(e) {
		return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
	}
	multiply(e) {
		return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
	}
	applyMatrix4(e) {
		let t = this.x, n = this.y, r = this.z, i = this.w, a = e.elements;
		return this.x = a[0] * t + a[4] * n + a[8] * r + a[12] * i, this.y = a[1] * t + a[5] * n + a[9] * r + a[13] * i, this.z = a[2] * t + a[6] * n + a[10] * r + a[14] * i, this.w = a[3] * t + a[7] * n + a[11] * r + a[15] * i, this;
	}
	divide(e) {
		return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
	}
	divideScalar(e) {
		return this.multiplyScalar(1 / e);
	}
	setAxisAngleFromQuaternion(e) {
		this.w = 2 * Math.acos(e.w);
		let t = Math.sqrt(1 - e.w * e.w);
		return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
	}
	setAxisAngleFromRotationMatrix(e) {
		let t, n, r, i, a = .01, o = .1, s = e.elements, c = s[0], l = s[4], u = s[8], d = s[1], f = s[5], p = s[9], m = s[2], h = s[6], g = s[10];
		if (Math.abs(l - d) < a && Math.abs(u - m) < a && Math.abs(p - h) < a) {
			if (Math.abs(l + d) < o && Math.abs(u + m) < o && Math.abs(p + h) < o && Math.abs(c + f + g - 3) < o) return this.set(1, 0, 0, 0), this;
			t = Math.PI;
			let e = (c + 1) / 2, s = (f + 1) / 2, _ = (g + 1) / 2, v = (l + d) / 4, y = (u + m) / 4, b = (p + h) / 4;
			return e > s && e > _ ? e < a ? (n = 0, r = .707106781, i = .707106781) : (n = Math.sqrt(e), r = v / n, i = y / n) : s > _ ? s < a ? (n = .707106781, r = 0, i = .707106781) : (r = Math.sqrt(s), n = v / r, i = b / r) : _ < a ? (n = .707106781, r = .707106781, i = 0) : (i = Math.sqrt(_), n = y / i, r = b / i), this.set(n, r, i, t), this;
		}
		let _ = Math.sqrt((h - p) * (h - p) + (u - m) * (u - m) + (d - l) * (d - l));
		return Math.abs(_) < .001 && (_ = 1), this.x = (h - p) / _, this.y = (u - m) / _, this.z = (d - l) / _, this.w = Math.acos((c + f + g - 1) / 2), this;
	}
	setFromMatrixPosition(e) {
		let t = e.elements;
		return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
	}
	min(e) {
		return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
	}
	max(e) {
		return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
	}
	clamp(e, t) {
		return this.x = H(this.x, e.x, t.x), this.y = H(this.y, e.y, t.y), this.z = H(this.z, e.z, t.z), this.w = H(this.w, e.w, t.w), this;
	}
	clampScalar(e, t) {
		return this.x = H(this.x, e, t), this.y = H(this.y, e, t), this.z = H(this.z, e, t), this.w = H(this.w, e, t), this;
	}
	clampLength(e, t) {
		let n = this.length();
		return this.divideScalar(n || 1).multiplyScalar(H(n, e, t));
	}
	floor() {
		return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
	}
	ceil() {
		return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
	}
	round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
	}
	roundToZero() {
		return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
	}
	negate() {
		return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
	}
	normalize() {
		return this.divideScalar(this.length() || 1);
	}
	setLength(e) {
		return this.normalize().multiplyScalar(e);
	}
	lerp(e, t) {
		return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
	}
	lerpVectors(e, t, n) {
		return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
	}
	equals(e) {
		return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
	}
	fromArray(e, t = 0) {
		return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
	}
	fromBufferAttribute(e, t) {
		return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
	}
	random() {
		return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y, yield this.z, yield this.w;
	}
}, Jt = class extends rt {
	constructor(e = 1, t = 1, n = {}) {
		super(), n = Object.assign({
			generateMipmaps: !1,
			internalFormat: null,
			minFilter: l,
			depthBuffer: !0,
			stencilBuffer: !1,
			resolveColorBuffer: !0,
			resolveDepthBuffer: !0,
			resolveStencilBuffer: !0,
			storeMultisampledColorBuffer: !0,
			storeMultisampledDepthBuffer: !0,
			storeMultisampledStencilBuffer: !0,
			depthTexture: null,
			samples: 0,
			count: 1,
			depth: 1,
			multiview: !1,
			useArrayDepthTexture: !1
		}, n), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = n.depth, this.scissor = new qt(0, 0, e, t), this.scissorTest = !1, this.viewport = new qt(0, 0, e, t), this.textures = [];
		let r = new Kt({
			width: e,
			height: t,
			depth: n.depth
		}), i = n.count;
		for (let e = 0; e < i; e++) this.textures[e] = r.clone(), this.textures[e].isRenderTargetTexture = !0, this.textures[e].renderTarget = this;
		this._setTextureOptions(n), this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveColorBuffer = n.resolveColorBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.storeMultisampledColorBuffer = n.storeMultisampledColorBuffer, this.storeMultisampledDepthBuffer = n.storeMultisampledDepthBuffer, this.storeMultisampledStencilBuffer = n.storeMultisampledStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview, this.useArrayDepthTexture = n.useArrayDepthTexture;
	}
	_setTextureOptions(e = {}) {
		let t = {
			minFilter: l,
			generateMipmaps: !1,
			flipY: !1,
			internalFormat: null
		};
		e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
		for (let e = 0; e < this.textures.length; e++) this.textures[e].setValues(t);
	}
	get texture() {
		return this.textures[0];
	}
	set texture(e) {
		this.textures[0] = e;
	}
	set depthTexture(e) {
		this._depthTexture !== null && this._depthTexture.renderTarget === this && (this._depthTexture.renderTarget = null), e !== null && e.renderTarget === null && (e.renderTarget = this), this._depthTexture = e;
	}
	get depthTexture() {
		return this._depthTexture;
	}
	setSize(e, t, n = 1) {
		if (this.width !== e || this.height !== t || this.depth !== n) {
			this.width = e, this.height = t, this.depth = n;
			for (let r = 0, i = this.textures.length; r < i; r++) this.textures[r].image.width = e, this.textures[r].image.height = t, this.textures[r].image.depth = n, this.textures[r].isData3DTexture !== !0 && (this.textures[r].isArrayTexture = this.textures[r].image.depth > 1);
			this.dispose();
		}
		this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
		for (let t = 0, n = e.textures.length; t < n; t++) {
			this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = !0, this.textures[t].renderTarget = this;
			let n = Object.assign({}, e.textures[t].image);
			this.textures[t].source = new Ht(n);
		}
		if (this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveColorBuffer = e.resolveColorBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, this.storeMultisampledColorBuffer = e.storeMultisampledColorBuffer, this.storeMultisampledDepthBuffer = e.storeMultisampledDepthBuffer, this.storeMultisampledStencilBuffer = e.storeMultisampledStencilBuffer, e.depthTexture !== null) {
			if (e.depthTexture.renderTarget === e) {
				let t = e.depthTexture.clone();
				t.renderTarget = null, this.depthTexture = t;
			} else this.depthTexture = e.depthTexture;
		}
		return this.samples = e.samples, this.multiview = e.multiview, this.useArrayDepthTexture = e.useArrayDepthTexture, this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}, Yt = class extends Jt {
	constructor(e = 1, t = 1, n = {}) {
		super(e, t, n), this.isWebGLRenderTarget = !0;
	}
}, Xt = class extends Kt {
	constructor(e = null, t = 1, n = 1, r = 1) {
		super(null), this.isDataArrayTexture = !0, this.image = {
			data: e,
			width: t,
			height: n,
			depth: r
		}, this.magFilter = o, this.minFilter = o, this.wrapR = i, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
	}
	copy(e) {
		return super.copy(e), this.wrapR = e.wrapR, this;
	}
	addLayerUpdate(e) {
		this.layerUpdates.add(e);
	}
	clearLayerUpdates() {
		this.layerUpdates.clear();
	}
}, Zt = class extends Kt {
	constructor(e = null, t = 1, n = 1, r = 1) {
		super(null), this.isData3DTexture = !0, this.image = {
			data: e,
			width: t,
			height: n,
			depth: r
		}, this.magFilter = o, this.minFilter = o, this.wrapR = i, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
	}
	copy(e) {
		return super.copy(e), this.wrapR = e.wrapR, this;
	}
}, q = class e {
	static {
		e.prototype.isMatrix4 = !0;
	}
	constructor(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		this.elements = [
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		], e !== void 0 && this.set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h);
	}
	set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		let g = this.elements;
		return g[0] = e, g[4] = t, g[8] = n, g[12] = r, g[1] = i, g[5] = a, g[9] = o, g[13] = s, g[2] = c, g[6] = l, g[10] = u, g[14] = d, g[3] = f, g[7] = p, g[11] = m, g[15] = h, this;
	}
	identity() {
		return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
	}
	clone() {
		return new e().fromArray(this.elements);
	}
	copy(e) {
		let t = this.elements, n = e.elements;
		return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
	}
	copyPosition(e) {
		let t = this.elements, n = e.elements;
		return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
	}
	setFromMatrix3(e) {
		let t = e.elements;
		return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this;
	}
	extractBasis(e, t, n) {
		return this.determinantAffine() === 0 ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this) : (e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this);
	}
	makeBasis(e, t, n) {
		return this.set(e.x, t.x, n.x, 0, e.y, t.y, n.y, 0, e.z, t.z, n.z, 0, 0, 0, 0, 1), this;
	}
	extractRotation(e) {
		if (e.determinantAffine() === 0) return this.identity();
		let t = this.elements, n = e.elements, r = 1 / Qt.setFromMatrixColumn(e, 0).length(), i = 1 / Qt.setFromMatrixColumn(e, 1).length(), a = 1 / Qt.setFromMatrixColumn(e, 2).length();
		return t[0] = n[0] * r, t[1] = n[1] * r, t[2] = n[2] * r, t[3] = 0, t[4] = n[4] * i, t[5] = n[5] * i, t[6] = n[6] * i, t[7] = 0, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
	}
	makeRotationFromEuler(e) {
		let t = this.elements, n = e.x, r = e.y, i = e.z, a = Math.cos(n), o = Math.sin(n), s = Math.cos(r), c = Math.sin(r), l = Math.cos(i), u = Math.sin(i);
		if (e.order === "XYZ") {
			let e = a * l, n = a * u, r = o * l, i = o * u;
			t[0] = s * l, t[4] = -s * u, t[8] = c, t[1] = n + r * c, t[5] = e - i * c, t[9] = -o * s, t[2] = i - e * c, t[6] = r + n * c, t[10] = a * s;
		} else if (e.order === "YXZ") {
			let e = s * l, n = s * u, r = c * l, i = c * u;
			t[0] = e + i * o, t[4] = r * o - n, t[8] = a * c, t[1] = a * u, t[5] = a * l, t[9] = -o, t[2] = n * o - r, t[6] = i + e * o, t[10] = a * s;
		} else if (e.order === "ZXY") {
			let e = s * l, n = s * u, r = c * l, i = c * u;
			t[0] = e - i * o, t[4] = -a * u, t[8] = r + n * o, t[1] = n + r * o, t[5] = a * l, t[9] = i - e * o, t[2] = -a * c, t[6] = o, t[10] = a * s;
		} else if (e.order === "ZYX") {
			let e = a * l, n = a * u, r = o * l, i = o * u;
			t[0] = s * l, t[4] = r * c - n, t[8] = e * c + i, t[1] = s * u, t[5] = i * c + e, t[9] = n * c - r, t[2] = -c, t[6] = o * s, t[10] = a * s;
		} else if (e.order === "YZX") {
			let e = a * s, n = a * c, r = o * s, i = o * c;
			t[0] = s * l, t[4] = i - e * u, t[8] = r * u + n, t[1] = u, t[5] = a * l, t[9] = -o * l, t[2] = -c * l, t[6] = n * u + r, t[10] = e - i * u;
		} else if (e.order === "XZY") {
			let e = a * s, n = a * c, r = o * s, i = o * c;
			t[0] = s * l, t[4] = -u, t[8] = c * l, t[1] = e * u + i, t[5] = a * l, t[9] = n * u - r, t[2] = r * u - n, t[6] = o * l, t[10] = i * u + e;
		}
		return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
	}
	makeRotationFromQuaternion(e) {
		return this.compose(en, e, tn);
	}
	lookAt(e, t, n) {
		let r = this.elements;
		return an.subVectors(e, t), an.lengthSq() === 0 && (an.z = 1), an.normalize(), nn.crossVectors(n, an), nn.lengthSq() === 0 && (Math.abs(n.z) === 1 ? an.x += 1e-4 : an.z += 1e-4, an.normalize(), nn.crossVectors(n, an)), nn.normalize(), rn.crossVectors(an, nn), r[0] = nn.x, r[4] = rn.x, r[8] = an.x, r[1] = nn.y, r[5] = rn.y, r[9] = an.y, r[2] = nn.z, r[6] = rn.z, r[10] = an.z, this;
	}
	multiply(e) {
		return this.multiplyMatrices(this, e);
	}
	premultiply(e) {
		return this.multiplyMatrices(e, this);
	}
	multiplyMatrices(e, t) {
		let n = e.elements, r = t.elements, i = this.elements, a = n[0], o = n[4], s = n[8], c = n[12], l = n[1], u = n[5], d = n[9], f = n[13], p = n[2], m = n[6], h = n[10], g = n[14], _ = n[3], v = n[7], y = n[11], b = n[15], x = r[0], S = r[4], C = r[8], w = r[12], T = r[1], E = r[5], D = r[9], O = r[13], k = r[2], A = r[6], j = r[10], ee = r[14], te = r[3], M = r[7], ne = r[11], N = r[15];
		return i[0] = a * x + o * T + s * k + c * te, i[4] = a * S + o * E + s * A + c * M, i[8] = a * C + o * D + s * j + c * ne, i[12] = a * w + o * O + s * ee + c * N, i[1] = l * x + u * T + d * k + f * te, i[5] = l * S + u * E + d * A + f * M, i[9] = l * C + u * D + d * j + f * ne, i[13] = l * w + u * O + d * ee + f * N, i[2] = p * x + m * T + h * k + g * te, i[6] = p * S + m * E + h * A + g * M, i[10] = p * C + m * D + h * j + g * ne, i[14] = p * w + m * O + h * ee + g * N, i[3] = _ * x + v * T + y * k + b * te, i[7] = _ * S + v * E + y * A + b * M, i[11] = _ * C + v * D + y * j + b * ne, i[15] = _ * w + v * O + y * ee + b * N, this;
	}
	multiplyScalar(e) {
		let t = this.elements;
		return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
	}
	determinant() {
		let e = this.elements, t = e[0], n = e[4], r = e[8], i = e[12], a = e[1], o = e[5], s = e[9], c = e[13], l = e[2], u = e[6], d = e[10], f = e[14], p = e[3], m = e[7], h = e[11], g = e[15], _ = s * f - c * d, v = o * f - c * u, y = o * d - s * u, b = a * f - c * l, x = a * d - s * l, S = a * u - o * l;
		return t * (m * _ - h * v + g * y) - n * (p * _ - h * b + g * x) + r * (p * v - m * b + g * S) - i * (p * y - m * x + h * S);
	}
	determinantAffine() {
		let e = this.elements, t = e[0], n = e[4], r = e[8], i = e[1], a = e[5], o = e[9], s = e[2], c = e[6], l = e[10];
		return t * (a * l - o * c) - n * (i * l - o * s) + r * (i * c - a * s);
	}
	transpose() {
		let e = this.elements, t;
		return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
	}
	setPosition(e, t, n) {
		let r = this.elements;
		return e.isVector3 ? (r[12] = e.x, r[13] = e.y, r[14] = e.z) : (r[12] = e, r[13] = t, r[14] = n), this;
	}
	invert() {
		let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = e[9], d = e[10], f = e[11], p = e[12], m = e[13], h = e[14], g = e[15], _ = t * o - n * a, v = t * s - r * a, y = t * c - i * a, b = n * s - r * o, x = n * c - i * o, S = r * c - i * s, C = l * m - u * p, w = l * h - d * p, T = l * g - f * p, E = u * h - d * m, D = u * g - f * m, O = d * g - f * h, k = _ * O - v * D + y * E + b * T - x * w + S * C;
		if (k === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		let A = 1 / k;
		return e[0] = (o * O - s * D + c * E) * A, e[1] = (r * D - n * O - i * E) * A, e[2] = (m * S - h * x + g * b) * A, e[3] = (d * x - u * S - f * b) * A, e[4] = (s * T - a * O - c * w) * A, e[5] = (t * O - r * T + i * w) * A, e[6] = (h * y - p * S - g * v) * A, e[7] = (l * S - d * y + f * v) * A, e[8] = (a * D - o * T + c * C) * A, e[9] = (n * T - t * D - i * C) * A, e[10] = (p * x - m * y + g * _) * A, e[11] = (u * y - l * x - f * _) * A, e[12] = (o * w - a * E - s * C) * A, e[13] = (t * E - n * w + r * C) * A, e[14] = (m * v - p * b - h * _) * A, e[15] = (l * b - u * v + d * _) * A, this;
	}
	scale(e) {
		let t = this.elements, n = e.x, r = e.y, i = e.z;
		return t[0] *= n, t[4] *= r, t[8] *= i, t[1] *= n, t[5] *= r, t[9] *= i, t[2] *= n, t[6] *= r, t[10] *= i, t[3] *= n, t[7] *= r, t[11] *= i, this;
	}
	getMaxScaleOnAxis() {
		let e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
		return Math.sqrt(Math.max(t, n, r));
	}
	makeTranslation(e, t, n) {
		return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1), this;
	}
	makeRotationX(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this;
	}
	makeRotationY(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this;
	}
	makeRotationZ(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
	}
	makeRotationAxis(e, t) {
		let n = Math.cos(t), r = Math.sin(t), i = 1 - n, a = e.x, o = e.y, s = e.z, c = i * a, l = i * o;
		return this.set(c * a + n, c * o - r * s, c * s + r * o, 0, c * o + r * s, l * o + n, l * s - r * a, 0, c * s - r * o, l * s + r * a, i * s * s + n, 0, 0, 0, 0, 1), this;
	}
	makeScale(e, t, n) {
		return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
	}
	makeShear(e, t, n, r, i, a) {
		return this.set(1, n, i, 0, e, 1, a, 0, t, r, 1, 0, 0, 0, 0, 1), this;
	}
	compose(e, t, n) {
		let r = this.elements, i = t._x, a = t._y, o = t._z, s = t._w, c = i + i, l = a + a, u = o + o, d = i * c, f = i * l, p = i * u, m = a * l, h = a * u, g = o * u, _ = s * c, v = s * l, y = s * u, b = n.x, x = n.y, S = n.z;
		return r[0] = (1 - (m + g)) * b, r[1] = (f + y) * b, r[2] = (p - v) * b, r[3] = 0, r[4] = (f - y) * x, r[5] = (1 - (d + g)) * x, r[6] = (h + _) * x, r[7] = 0, r[8] = (p + v) * S, r[9] = (h - _) * S, r[10] = (1 - (d + m)) * S, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this;
	}
	decompose(e, t, n) {
		let r = this.elements;
		e.x = r[12], e.y = r[13], e.z = r[14];
		let i = this.determinantAffine();
		if (i === 0) return n.set(1, 1, 1), t.identity(), this;
		let a = Qt.set(r[0], r[1], r[2]).length(), o = Qt.set(r[4], r[5], r[6]).length(), s = Qt.set(r[8], r[9], r[10]).length();
		i < 0 && (a = -a), $t.copy(this);
		let c = 1 / a, l = 1 / o, u = 1 / s;
		return $t.elements[0] *= c, $t.elements[1] *= c, $t.elements[2] *= c, $t.elements[4] *= l, $t.elements[5] *= l, $t.elements[6] *= l, $t.elements[8] *= u, $t.elements[9] *= u, $t.elements[10] *= u, t.setFromRotationMatrix($t), n.x = a, n.y = o, n.z = s, this;
	}
	makePerspective(e, t, n, r, i, a, o = Ke, s = !1) {
		let c = this.elements, l = 2 * i / (t - e), u = 2 * i / (n - r), d = (t + e) / (t - e), f = (n + r) / (n - r), p, m;
		if (s) p = i / (a - i), m = a * i / (a - i);
		else if (o === 2e3) p = -(a + i) / (a - i), m = -2 * a * i / (a - i);
		else if (o === 2001) p = -a / (a - i), m = -a * i / (a - i);
		else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
		return c[0] = l, c[4] = 0, c[8] = d, c[12] = 0, c[1] = 0, c[5] = u, c[9] = f, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
	}
	makeOrthographic(e, t, n, r, i, a, o = Ke, s = !1) {
		let c = this.elements, l = 2 / (t - e), u = 2 / (n - r), d = -(t + e) / (t - e), f = -(n + r) / (n - r), p, m;
		if (s) p = 1 / (a - i), m = a / (a - i);
		else if (o === 2e3) p = -2 / (a - i), m = -(a + i) / (a - i);
		else if (o === 2001) p = -1 / (a - i), m = -i / (a - i);
		else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
		return c[0] = l, c[4] = 0, c[8] = 0, c[12] = d, c[1] = 0, c[5] = u, c[9] = 0, c[13] = f, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
	}
	equals(e) {
		let t = this.elements, n = e.elements;
		for (let e = 0; e < 16; e++) if (t[e] !== n[e]) return !1;
		return !0;
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
		return this;
	}
	toArray(e = [], t = 0) {
		let n = this.elements;
		return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
	}
}, Qt = /*@__PURE__*/ new W(), $t = /*@__PURE__*/ new q(), en = /*@__PURE__*/ new W(0, 0, 0), tn = /*@__PURE__*/ new W(1, 1, 1), nn = /*@__PURE__*/ new W(), rn = /*@__PURE__*/ new W(), an = /*@__PURE__*/ new W(), on = /*@__PURE__*/ new q(), sn = /*@__PURE__*/ new At(), cn = class e {
	constructor(t = 0, n = 0, r = 0, i = e.DEFAULT_ORDER) {
		this.isEuler = !0, this._x = t, this._y = n, this._z = r, this._order = i;
	}
	get x() {
		return this._x;
	}
	set x(e) {
		this._x = e, this._onChangeCallback();
	}
	get y() {
		return this._y;
	}
	set y(e) {
		this._y = e, this._onChangeCallback();
	}
	get z() {
		return this._z;
	}
	set z(e) {
		this._z = e, this._onChangeCallback();
	}
	get order() {
		return this._order;
	}
	set order(e) {
		this._order = e, this._onChangeCallback();
	}
	set(e, t, n, r = this._order) {
		return this._x = e, this._y = t, this._z = n, this._order = r, this._onChangeCallback(), this;
	}
	clone() {
		return new this.constructor(this._x, this._y, this._z, this._order);
	}
	copy(e) {
		return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
	}
	setFromRotationMatrix(e, t = this._order, n = !0) {
		let r = e.elements, i = r[0], a = r[4], o = r[8], s = r[1], c = r[5], l = r[9], u = r[2], d = r[6], f = r[10];
		switch (t) {
			case "XYZ":
				this._y = Math.asin(H(o, -1, 1)), Math.abs(o) < .9999999 ? (this._x = Math.atan2(-l, f), this._z = Math.atan2(-a, i)) : (this._x = Math.atan2(d, c), this._z = 0);
				break;
			case "YXZ":
				this._x = Math.asin(-H(l, -1, 1)), Math.abs(l) < .9999999 ? (this._y = Math.atan2(o, f), this._z = Math.atan2(s, c)) : (this._y = Math.atan2(-u, i), this._z = 0);
				break;
			case "ZXY":
				this._x = Math.asin(H(d, -1, 1)), Math.abs(d) < .9999999 ? (this._y = Math.atan2(-u, f), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(s, i));
				break;
			case "ZYX":
				this._y = Math.asin(-H(u, -1, 1)), Math.abs(u) < .9999999 ? (this._x = Math.atan2(d, f), this._z = Math.atan2(s, i)) : (this._x = 0, this._z = Math.atan2(-a, c));
				break;
			case "YZX":
				this._z = Math.asin(H(s, -1, 1)), Math.abs(s) < .9999999 ? (this._x = Math.atan2(-l, c), this._y = Math.atan2(-u, i)) : (this._x = 0, this._y = Math.atan2(o, f));
				break;
			case "XZY":
				this._z = Math.asin(-H(a, -1, 1)), Math.abs(a) < .9999999 ? (this._x = Math.atan2(d, c), this._y = Math.atan2(o, i)) : (this._x = Math.atan2(-l, f), this._y = 0);
				break;
			default: B("Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
		}
		return this._order = t, n === !0 && this._onChangeCallback(), this;
	}
	setFromQuaternion(e, t, n) {
		return on.makeRotationFromQuaternion(e), this.setFromRotationMatrix(on, t, n);
	}
	setFromVector3(e, t = this._order) {
		return this.set(e.x, e.y, e.z, t);
	}
	reorder(e) {
		return sn.setFromEuler(this), this.setFromQuaternion(sn, e);
	}
	equals(e) {
		return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
	}
	fromArray(e) {
		return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
	}
	_onChange(e) {
		return this._onChangeCallback = e, this;
	}
	_onChangeCallback() {}
	*[Symbol.iterator]() {
		yield this._x, yield this._y, yield this._z, yield this._order;
	}
};
cn.DEFAULT_ORDER = "XYZ";
var ln = class {
	constructor() {
		this.mask = 1;
	}
	set(e) {
		this.mask = 1 << e >>> 0;
	}
	enable(e) {
		this.mask |= 1 << e;
	}
	enableAll() {
		this.mask = -1;
	}
	toggle(e) {
		this.mask ^= 1 << e;
	}
	disable(e) {
		this.mask &= ~(1 << e);
	}
	disableAll() {
		this.mask = 0;
	}
	test(e) {
		return (this.mask & e.mask) !== 0;
	}
	isEnabled(e) {
		return !!(this.mask & 1 << e);
	}
}, un = 0, dn = /*@__PURE__*/ new W(), fn = /*@__PURE__*/ new At(), pn = /*@__PURE__*/ new q(), mn = /*@__PURE__*/ new W(), hn = /*@__PURE__*/ new W(), gn = /*@__PURE__*/ new W(), _n = /*@__PURE__*/ new At(), vn = /*@__PURE__*/ new W(1, 0, 0), yn = /*@__PURE__*/ new W(0, 1, 0), bn = /*@__PURE__*/ new W(0, 0, 1), xn = { type: "added" }, Sn = { type: "removed" }, Cn = {
	type: "childadded",
	child: null
}, wn = {
	type: "childremoved",
	child: null
}, Tn = class e extends rt {
	constructor() {
		super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: un++ }), this.uuid = ct(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = e.DEFAULT_UP.clone();
		let t = new W(), n = new cn(), r = new At(), i = new W(1, 1, 1);
		function a() {
			r.setFromEuler(n, !1);
		}
		function o() {
			n.setFromQuaternion(r, void 0, !1);
		}
		n._onChange(a), r._onChange(o), Object.defineProperties(this, {
			position: {
				configurable: !0,
				enumerable: !0,
				value: t
			},
			rotation: {
				configurable: !0,
				enumerable: !0,
				value: n
			},
			quaternion: {
				configurable: !0,
				enumerable: !0,
				value: r
			},
			scale: {
				configurable: !0,
				enumerable: !0,
				value: i
			},
			modelViewMatrix: { value: new q() },
			normalMatrix: { value: new G() }
		}), this.matrix = new q(), this.matrixWorld = new q(), this.matrixAutoUpdate = e.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new ln(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.static = !1, this.userData = {}, this.pivot = null;
	}
	onBeforeShadow() {}
	onAfterShadow() {}
	onBeforeRender() {}
	onAfterRender() {}
	applyMatrix4(e) {
		this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
	}
	applyQuaternion(e) {
		return this.quaternion.premultiply(e), this;
	}
	setRotationFromAxisAngle(e, t) {
		this.quaternion.setFromAxisAngle(e, t);
	}
	setRotationFromEuler(e) {
		this.quaternion.setFromEuler(e, !0);
	}
	setRotationFromMatrix(e) {
		this.quaternion.setFromRotationMatrix(e);
	}
	setRotationFromQuaternion(e) {
		this.quaternion.copy(e);
	}
	rotateOnAxis(e, t) {
		return fn.setFromAxisAngle(e, t), this.quaternion.multiply(fn), this;
	}
	rotateOnWorldAxis(e, t) {
		return fn.setFromAxisAngle(e, t), this.quaternion.premultiply(fn), this;
	}
	rotateX(e) {
		return this.rotateOnAxis(vn, e);
	}
	rotateY(e) {
		return this.rotateOnAxis(yn, e);
	}
	rotateZ(e) {
		return this.rotateOnAxis(bn, e);
	}
	translateOnAxis(e, t) {
		return dn.copy(e).applyQuaternion(this.quaternion), this.position.add(dn.multiplyScalar(t)), this;
	}
	translateX(e) {
		return this.translateOnAxis(vn, e);
	}
	translateY(e) {
		return this.translateOnAxis(yn, e);
	}
	translateZ(e) {
		return this.translateOnAxis(bn, e);
	}
	localToWorld(e) {
		return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
	}
	worldToLocal(e) {
		return this.updateWorldMatrix(!0, !1), e.applyMatrix4(pn.copy(this.matrixWorld).invert());
	}
	lookAt(e, t, n) {
		e.isVector3 ? mn.copy(e) : mn.set(e, t, n);
		let r = this.parent;
		this.updateWorldMatrix(!0, !1), hn.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? pn.lookAt(hn, mn, this.up) : pn.lookAt(mn, hn, this.up), this.quaternion.setFromRotationMatrix(pn), r && (pn.extractRotation(r.matrixWorld), fn.setFromRotationMatrix(pn), this.quaternion.premultiply(fn.invert()));
	}
	add(e) {
		if (arguments.length > 1) {
			for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
			return this;
		}
		return e === this ? (V("Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(xn), Cn.child = e, this.dispatchEvent(Cn), Cn.child = null) : V("Object3D.add: object not an instance of THREE.Object3D.", e), this);
	}
	remove(e) {
		if (arguments.length > 1) {
			for (let e = 0; e < arguments.length; e++) this.remove(arguments[e]);
			return this;
		}
		let t = this.children.indexOf(e);
		return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(Sn), wn.child = e, this.dispatchEvent(wn), wn.child = null), this;
	}
	removeFromParent() {
		let e = this.parent;
		return e !== null && e.remove(this), this;
	}
	clear() {
		return this.remove(...this.children);
	}
	attach(e) {
		return this.updateWorldMatrix(!0, !1), pn.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), pn.multiply(e.parent.matrixWorld)), e.applyMatrix4(pn), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(xn), Cn.child = e, this.dispatchEvent(Cn), Cn.child = null, this;
	}
	getObjectById(e) {
		return this.getObjectByProperty("id", e);
	}
	getObjectByName(e) {
		return this.getObjectByProperty("name", e);
	}
	getObjectByProperty(e, t) {
		if (this[e] === t) return this;
		for (let n = 0, r = this.children.length; n < r; n++) {
			let r = this.children[n].getObjectByProperty(e, t);
			if (r !== void 0) return r;
		}
	}
	getObjectsByProperty(e, t, n = []) {
		this[e] === t && n.push(this);
		let r = this.children;
		for (let i = 0, a = r.length; i < a; i++) r[i].getObjectsByProperty(e, t, n);
		return n;
	}
	getWorldPosition(e) {
		return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
	}
	getWorldQuaternion(e) {
		return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(hn, e, gn), e;
	}
	getWorldScale(e) {
		return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(hn, _n, e), e;
	}
	getWorldDirection(e) {
		this.updateWorldMatrix(!0, !1);
		let t = this.matrixWorld.elements;
		return e.set(t[8], t[9], t[10]).normalize();
	}
	raycast() {}
	intersectsFrustum() {}
	traverse(e) {
		e(this);
		let t = this.children;
		for (let n = 0, r = t.length; n < r; n++) t[n].traverse(e);
	}
	traverseVisible(e) {
		if (this.visible === !1) return;
		e(this);
		let t = this.children;
		for (let n = 0, r = t.length; n < r; n++) t[n].traverseVisible(e);
	}
	traverseAncestors(e) {
		let t = this.parent;
		t !== null && (e(t), t.traverseAncestors(e));
	}
	updateMatrix() {
		this.matrix.compose(this.position, this.quaternion, this.scale);
		let e = this.pivot;
		if (e !== null) {
			let t = e.x, n = e.y, r = e.z, i = this.matrix.elements;
			i[12] += t - i[0] * t - i[4] * n - i[8] * r, i[13] += n - i[1] * t - i[5] * n - i[9] * r, i[14] += r - i[2] * t - i[6] * n - i[10] * r;
		}
		this.matrixWorldNeedsUpdate = !0;
	}
	updateMatrixWorld(e) {
		this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
		let t = this.children;
		for (let n = 0, r = t.length; n < r; n++) t[n].updateMatrixWorld(e);
	}
	updateWorldMatrix(e, t, n = !1) {
		let r = this.parent;
		if (e === !0 && r !== null && r.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || n) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, n = !0), t === !0) {
			let e = this.children;
			for (let t = 0, r = e.length; t < r; t++) e[t].updateWorldMatrix(!1, !0, n);
		}
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string", n = {};
		t && (e = {
			geometries: {},
			materials: {},
			textures: {},
			images: {},
			shapes: {},
			skeletons: {},
			animations: {},
			nodes: {}
		}, n.metadata = {
			version: 4.7,
			type: "Object",
			generator: "Object3D.toJSON"
		});
		let r = {};
		r.uuid = this.uuid, r.type = this.type, r.name = this.name, r.castShadow = this.castShadow, r.receiveShadow = this.receiveShadow, r.visible = this.visible, r.frustumCulled = this.frustumCulled, r.renderOrder = this.renderOrder, r.static = this.static, r.matrixAutoUpdate = this.matrixAutoUpdate, Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.pivot !== null && (r.pivot = this.pivot.toArray()), this.morphTargetDictionary !== void 0 && (r.morphTargetDictionary = Object.assign({}, this.morphTargetDictionary)), this.morphTargetInfluences !== void 0 && (r.morphTargetInfluences = this.morphTargetInfluences.slice()), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.geometryInfo = this._geometryInfo.map((e) => ({
			...e,
			boundingBox: e.boundingBox ? e.boundingBox.toJSON() : void 0,
			boundingSphere: e.boundingSphere ? e.boundingSphere.toJSON() : void 0
		})), r.instanceInfo = this._instanceInfo.map((e) => ({ ...e })), r.availableInstanceIds = this._availableInstanceIds.slice(), r.availableGeometryIds = this._availableGeometryIds.slice(), r.nextIndexStart = this._nextIndexStart, r.nextVertexStart = this._nextVertexStart, r.geometryCount = this._geometryCount, r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.matricesTexture = this._matricesTexture.toJSON(e), r.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (r.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r.boundingBox = this.boundingBox.toJSON()));
		function i(t, n) {
			return t[n.uuid] === void 0 && (t[n.uuid] = n.toJSON(e)), n.uuid;
		}
		if (this.isScene) this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(e).uuid);
		else if (this.isMesh || this.isLine || this.isPoints) {
			r.geometry = i(e.geometries, this.geometry);
			let t = this.geometry.parameters;
			if (t !== void 0 && t.shapes !== void 0) {
				let n = t.shapes;
				if (Array.isArray(n)) for (let t = 0, r = n.length; t < r; t++) {
					let r = n[t];
					i(e.shapes, r);
				}
				else i(e.shapes, n);
			}
		}
		if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (i(e.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0) {
			if (Array.isArray(this.material)) {
				let t = [];
				for (let n = 0, r = this.material.length; n < r; n++) t.push(i(e.materials, this.material[n]));
				r.material = t;
			} else r.material = i(e.materials, this.material);
		}
		if (this.children.length > 0) {
			r.children = [];
			for (let t = 0; t < this.children.length; t++) r.children.push(this.children[t].toJSON(e).object);
		}
		if (this.animations.length > 0) {
			r.animations = [];
			for (let t = 0; t < this.animations.length; t++) {
				let n = this.animations[t];
				r.animations.push(i(e.animations, n));
			}
		}
		if (t) {
			let t = a(e.geometries), r = a(e.materials), i = a(e.textures), o = a(e.images), s = a(e.shapes), c = a(e.skeletons), l = a(e.animations), u = a(e.nodes);
			t.length > 0 && (n.geometries = t), r.length > 0 && (n.materials = r), i.length > 0 && (n.textures = i), o.length > 0 && (n.images = o), s.length > 0 && (n.shapes = s), c.length > 0 && (n.skeletons = c), l.length > 0 && (n.animations = l), u.length > 0 && (n.nodes = u);
		}
		return n.object = r, n;
		function a(e) {
			let t = [];
			for (let n in e) {
				let r = e[n];
				delete r.metadata, t.push(r);
			}
			return t;
		}
	}
	clone(e) {
		return new this.constructor().copy(this, e);
	}
	copy(e, t = !0) {
		if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.pivot = e.pivot === null ? null : e.pivot.clone(), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.static = e.static, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0) for (let t = 0; t < e.children.length; t++) {
			let n = e.children[t];
			this.add(n.clone());
		}
		return this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
};
Tn.DEFAULT_UP = /*@__PURE__*/ new W(0, 1, 0), Tn.DEFAULT_MATRIX_AUTO_UPDATE = !0, Tn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
var En = class extends Tn {
	constructor() {
		super(), this.isGroup = !0, this.type = "Group";
	}
}, Dn = { type: "move" }, On = class {
	constructor() {
		this._targetRay = null, this._grip = null, this._hand = null;
	}
	getHandSpace() {
		return this._hand === null && (this._hand = new En(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
	}
	getTargetRaySpace() {
		return this._targetRay === null && (this._targetRay = new En(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new W(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new W()), this._targetRay;
	}
	getGripSpace() {
		return this._grip === null && (this._grip = new En(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new W(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new W(), this._grip.eventsEnabled = !1), this._grip;
	}
	dispatchEvent(e) {
		return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
	}
	connect(e) {
		if (e && e.hand) {
			let t = this._hand;
			if (t) for (let n of e.hand.values()) this._getHandJoint(t, n);
		}
		return this.dispatchEvent({
			type: "connected",
			data: e
		}), this;
	}
	disconnect(e) {
		return this.dispatchEvent({
			type: "disconnected",
			data: e
		}), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
	}
	update(e, t, n) {
		let r = null, i = null, a = null, o = this._targetRay, s = this._grip, c = this._hand;
		if (e && t.session.visibilityState !== "visible-blurred") {
			if (c && e.hand) {
				a = !0;
				for (let r of e.hand.values()) {
					let e = t.getJointPose(r, n), i = this._getHandJoint(c, r);
					e !== null && (i.matrix.fromArray(e.transform.matrix), i.matrix.decompose(i.position, i.rotation, i.scale), i.matrixWorldNeedsUpdate = !0, i.jointRadius = e.radius), i.visible = e !== null;
				}
				let r = c.joints["index-finger-tip"], i = c.joints["thumb-tip"], o = r.position.distanceTo(i.position);
				c.inputState.pinching && o > .025 ? (c.inputState.pinching = !1, this.dispatchEvent({
					type: "pinchend",
					handedness: e.handedness,
					target: this
				})) : !c.inputState.pinching && o <= .015 && (c.inputState.pinching = !0, this.dispatchEvent({
					type: "pinchstart",
					handedness: e.handedness,
					target: this
				}));
			} else s !== null && e.gripSpace && (i = t.getPose(e.gripSpace, n), i !== null && (s.matrix.fromArray(i.transform.matrix), s.matrix.decompose(s.position, s.rotation, s.scale), s.matrixWorldNeedsUpdate = !0, i.linearVelocity ? (s.hasLinearVelocity = !0, s.linearVelocity.copy(i.linearVelocity)) : s.hasLinearVelocity = !1, i.angularVelocity ? (s.hasAngularVelocity = !0, s.angularVelocity.copy(i.angularVelocity)) : s.hasAngularVelocity = !1, s.eventsEnabled && s.dispatchEvent({
				type: "gripUpdated",
				data: e,
				target: this
			})));
			o !== null && (r = t.getPose(e.targetRaySpace, n), r === null && i !== null && (r = i), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Dn)));
		}
		return o !== null && (o.visible = r !== null), s !== null && (s.visible = i !== null), c !== null && (c.visible = a !== null), this;
	}
	_getHandJoint(e, t) {
		if (e.joints[t.jointName] === void 0) {
			let n = new En();
			n.matrixAutoUpdate = !1, n.visible = !1, e.joints[t.jointName] = n, e.add(n);
		}
		return e.joints[t.jointName];
	}
}, kn = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
}, An = {
	h: 0,
	s: 0,
	l: 0
}, jn = {
	h: 0,
	s: 0,
	l: 0
};
function Mn(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * 6 * (2 / 3 - n) : e;
}
var J = class {
	constructor(e, t, n) {
		return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
	}
	set(e, t, n) {
		if (t === void 0 && n === void 0) {
			let t = e;
			t && t.isColor ? this.copy(t) : typeof t == "number" ? this.setHex(t) : typeof t == "string" && this.setStyle(t);
		} else this.setRGB(e, t, n);
		return this;
	}
	setScalar(e) {
		return this.r = e, this.g = e, this.b = e, this;
	}
	setHex(e, t = Be) {
		return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, K.colorSpaceToWorking(this, t), this;
	}
	setRGB(e, t, n, r = K.workingColorSpace) {
		return this.r = e, this.g = t, this.b = n, K.colorSpaceToWorking(this, r), this;
	}
	setHSL(e, t, n, r = K.workingColorSpace) {
		if (e = lt(e, 1), t = H(t, 0, 1), n = H(n, 0, 1), t === 0) this.r = this.g = this.b = n;
		else {
			let r = n <= .5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r;
			this.r = Mn(i, r, e + 1 / 3), this.g = Mn(i, r, e), this.b = Mn(i, r, e - 1 / 3);
		}
		return K.colorSpaceToWorking(this, r), this;
	}
	setStyle(e, t = Be) {
		function n(t) {
			t !== void 0 && parseFloat(t) < 1 && B("Color: Alpha component of " + e + " will be ignored.");
		}
		let r;
		if (r = /^(\w+)\(([^\)]*)\)/.exec(e)) {
			let i, a = r[1], o = r[2];
			switch (a) {
				case "rgb":
				case "rgba":
					if (i = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setRGB(Math.min(255, parseInt(i[1], 10)) / 255, Math.min(255, parseInt(i[2], 10)) / 255, Math.min(255, parseInt(i[3], 10)) / 255, t);
					if (i = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setRGB(Math.min(100, parseInt(i[1], 10)) / 100, Math.min(100, parseInt(i[2], 10)) / 100, Math.min(100, parseInt(i[3], 10)) / 100, t);
					break;
				case "hsl":
				case "hsla":
					if (i = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setHSL(parseFloat(i[1]) / 360, parseFloat(i[2]) / 100, parseFloat(i[3]) / 100, t);
					break;
				default: B("Color: Unknown color model " + e);
			}
		} else if (r = /^\#([A-Fa-f\d]+)$/.exec(e)) {
			let n = r[1], i = n.length;
			if (i === 3) return this.setRGB(parseInt(n.charAt(0), 16) / 15, parseInt(n.charAt(1), 16) / 15, parseInt(n.charAt(2), 16) / 15, t);
			if (i === 6) return this.setHex(parseInt(n, 16), t);
			B("Color: Invalid hex color " + e);
		} else if (e && e.length > 0) return this.setColorName(e, t);
		return this;
	}
	setColorName(e, t = Be) {
		let n = kn[e.toLowerCase()];
		return n === void 0 ? B("Color: Unknown color " + e) : this.setHex(n, t), this;
	}
	clone() {
		return new this.constructor(this.r, this.g, this.b);
	}
	copy(e) {
		return this.r = e.r, this.g = e.g, this.b = e.b, this;
	}
	copySRGBToLinear(e) {
		return this.r = Lt(e.r), this.g = Lt(e.g), this.b = Lt(e.b), this;
	}
	copyLinearToSRGB(e) {
		return this.r = Rt(e.r), this.g = Rt(e.g), this.b = Rt(e.b), this;
	}
	convertSRGBToLinear() {
		return this.copySRGBToLinear(this), this;
	}
	convertLinearToSRGB() {
		return this.copyLinearToSRGB(this), this;
	}
	getHex(e = Be) {
		return K.workingToColorSpace(Nn.copy(this), e), Math.round(H(Nn.r * 255, 0, 255)) * 65536 + Math.round(H(Nn.g * 255, 0, 255)) * 256 + Math.round(H(Nn.b * 255, 0, 255));
	}
	getHexString(e = Be) {
		return ("000000" + this.getHex(e).toString(16)).slice(-6);
	}
	getHSL(e, t = K.workingColorSpace) {
		K.workingToColorSpace(Nn.copy(this), t);
		let n = Nn.r, r = Nn.g, i = Nn.b, a = Math.max(n, r, i), o = Math.min(n, r, i), s, c, l = (o + a) / 2;
		if (o === a) s = 0, c = 0;
		else {
			let e = a - o;
			switch (c = l <= .5 ? e / (a + o) : e / (2 - a - o), a) {
				case n:
					s = (r - i) / e + (r < i ? 6 : 0);
					break;
				case r:
					s = (i - n) / e + 2;
					break;
				case i: s = (n - r) / e + 4;
			}
			s /= 6;
		}
		return e.h = s, e.s = c, e.l = l, e;
	}
	getRGB(e, t = K.workingColorSpace) {
		return K.workingToColorSpace(Nn.copy(this), t), e.r = Nn.r, e.g = Nn.g, e.b = Nn.b, e;
	}
	getStyle(e = Be) {
		K.workingToColorSpace(Nn.copy(this), e);
		let t = Nn.r, n = Nn.g, r = Nn.b;
		return e === "srgb" ? `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(r * 255)})` : `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`;
	}
	offsetHSL(e, t, n) {
		return this.getHSL(An), this.setHSL(An.h + e, An.s + t, An.l + n);
	}
	add(e) {
		return this.r += e.r, this.g += e.g, this.b += e.b, this;
	}
	addColors(e, t) {
		return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
	}
	addScalar(e) {
		return this.r += e, this.g += e, this.b += e, this;
	}
	sub(e) {
		return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
	}
	multiply(e) {
		return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
	}
	multiplyScalar(e) {
		return this.r *= e, this.g *= e, this.b *= e, this;
	}
	lerp(e, t) {
		return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
	}
	lerpColors(e, t, n) {
		return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
	}
	lerpHSL(e, t) {
		this.getHSL(An), e.getHSL(jn);
		let n = ft(An.h, jn.h, t), r = ft(An.s, jn.s, t), i = ft(An.l, jn.l, t);
		return this.setHSL(n, r, i), this;
	}
	setFromVector3(e) {
		return this.r = e.x, this.g = e.y, this.b = e.z, this;
	}
	applyMatrix3(e) {
		let t = this.r, n = this.g, r = this.b, i = e.elements;
		return this.r = i[0] * t + i[3] * n + i[6] * r, this.g = i[1] * t + i[4] * n + i[7] * r, this.b = i[2] * t + i[5] * n + i[8] * r, this;
	}
	equals(e) {
		return e.r === this.r && e.g === this.g && e.b === this.b;
	}
	fromArray(e, t = 0) {
		return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
	}
	fromBufferAttribute(e, t) {
		return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
	}
	toJSON() {
		return this.getHex();
	}
	*[Symbol.iterator]() {
		yield this.r, yield this.g, yield this.b;
	}
}, Nn = /*@__PURE__*/ new J();
J.NAMES = kn;
var Pn = class extends Tn {
	constructor() {
		super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new cn(), this.environmentIntensity = 1, this.environmentRotation = new cn(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	copy(e, t) {
		return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return this.fog !== null && (t.object.fog = this.fog.toJSON()), t.object.backgroundBlurriness = this.backgroundBlurriness, t.object.backgroundIntensity = this.backgroundIntensity, t.object.backgroundRotation = this.backgroundRotation.toArray(), t.object.environmentIntensity = this.environmentIntensity, t.object.environmentRotation = this.environmentRotation.toArray(), t;
	}
}, Fn = /*@__PURE__*/ new W(), In = /*@__PURE__*/ new W(), Ln = /*@__PURE__*/ new W(), Rn = /*@__PURE__*/ new W(), zn = /*@__PURE__*/ new W(), Bn = /*@__PURE__*/ new W(), Vn = /*@__PURE__*/ new W(), Hn = /*@__PURE__*/ new W(), Un = /*@__PURE__*/ new W(), Wn = /*@__PURE__*/ new W(), Gn = /*@__PURE__*/ new qt(), Kn = /*@__PURE__*/ new qt(), qn = /*@__PURE__*/ new qt(), Jn = class e {
	constructor(e = new W(), t = new W(), n = new W()) {
		this.a = e, this.b = t, this.c = n;
	}
	static getNormal(e, t, n, r) {
		r.subVectors(n, t), Fn.subVectors(e, t), r.cross(Fn);
		let i = r.lengthSq();
		return i > 0 ? r.multiplyScalar(1 / Math.sqrt(i)) : r.set(0, 0, 0);
	}
	static getBarycoord(e, t, n, r, i) {
		Fn.subVectors(r, t), In.subVectors(n, t), Ln.subVectors(e, t);
		let a = Fn.dot(Fn), o = Fn.dot(In), s = Fn.dot(Ln), c = In.dot(In), l = In.dot(Ln), u = a * c - o * o;
		if (u === 0) return i.set(0, 0, 0), null;
		let d = 1 / u, f = (c * s - o * l) * d, p = (a * l - o * s) * d;
		return i.set(1 - f - p, p, f);
	}
	static containsPoint(e, t, n, r) {
		return this.getBarycoord(e, t, n, r, Rn) !== null && Rn.x >= 0 && Rn.y >= 0 && Rn.x + Rn.y <= 1;
	}
	static getInterpolation(e, t, n, r, i, a, o, s) {
		return this.getBarycoord(e, t, n, r, Rn) === null ? (s.x = 0, s.y = 0, "z" in s && (s.z = 0), "w" in s && (s.w = 0), null) : (s.setScalar(0), s.addScaledVector(i, Rn.x), s.addScaledVector(a, Rn.y), s.addScaledVector(o, Rn.z), s);
	}
	static getInterpolatedAttribute(e, t, n, r, i, a) {
		return Gn.setScalar(0), Kn.setScalar(0), qn.setScalar(0), Gn.fromBufferAttribute(e, t), Kn.fromBufferAttribute(e, n), qn.fromBufferAttribute(e, r), a.setScalar(0), a.addScaledVector(Gn, i.x), a.addScaledVector(Kn, i.y), a.addScaledVector(qn, i.z), a;
	}
	static isFrontFacing(e, t, n, r) {
		return Fn.subVectors(n, t), In.subVectors(e, t), Fn.cross(In).dot(r) < 0;
	}
	set(e, t, n) {
		return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
	}
	setFromPointsAndIndices(e, t, n, r) {
		return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[r]), this;
	}
	setFromAttributeAndIndices(e, t, n, r) {
		return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, r), this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
	}
	getArea() {
		return Fn.subVectors(this.c, this.b), In.subVectors(this.a, this.b), Fn.cross(In).length() * .5;
	}
	getMidpoint(e) {
		return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
	}
	getNormal(t) {
		return e.getNormal(this.a, this.b, this.c, t);
	}
	getPlane(e) {
		return e.setFromCoplanarPoints(this.a, this.b, this.c);
	}
	getBarycoord(t, n) {
		return e.getBarycoord(t, this.a, this.b, this.c, n);
	}
	getInterpolation(t, n, r, i, a) {
		return e.getInterpolation(t, this.a, this.b, this.c, n, r, i, a);
	}
	containsPoint(t) {
		return e.containsPoint(t, this.a, this.b, this.c);
	}
	isFrontFacing(t) {
		return e.isFrontFacing(this.a, this.b, this.c, t);
	}
	intersectsBox(e) {
		return e.intersectsTriangle(this);
	}
	closestPointToPoint(e, t) {
		let n = this.a, r = this.b, i = this.c, a, o;
		zn.subVectors(r, n), Bn.subVectors(i, n), Hn.subVectors(e, n);
		let s = zn.dot(Hn), c = Bn.dot(Hn);
		if (s <= 0 && c <= 0) return t.copy(n);
		Un.subVectors(e, r);
		let l = zn.dot(Un), u = Bn.dot(Un);
		if (l >= 0 && u <= l) return t.copy(r);
		let d = s * u - l * c;
		if (d <= 0 && s >= 0 && l <= 0) return a = s / (s - l), t.copy(n).addScaledVector(zn, a);
		Wn.subVectors(e, i);
		let f = zn.dot(Wn), p = Bn.dot(Wn);
		if (p >= 0 && f <= p) return t.copy(i);
		let m = f * c - s * p;
		if (m <= 0 && c >= 0 && p <= 0) return o = c / (c - p), t.copy(n).addScaledVector(Bn, o);
		let h = l * p - f * u;
		if (h <= 0 && u - l >= 0 && f - p >= 0) return Vn.subVectors(i, r), o = (u - l) / (u - l + (f - p)), t.copy(r).addScaledVector(Vn, o);
		let g = 1 / (h + m + d);
		return a = m * g, o = d * g, t.copy(n).addScaledVector(zn, a).addScaledVector(Bn, o);
	}
	equals(e) {
		return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
	}
}, Yn = class {
	constructor(e = new W(Infinity, Infinity, Infinity), t = new W(-Infinity, -Infinity, -Infinity)) {
		this.isBox3 = !0, this.min = e, this.max = t;
	}
	set(e, t) {
		return this.min.copy(e), this.max.copy(t), this;
	}
	setFromArray(e) {
		this.makeEmpty();
		for (let t = 0, n = e.length; t < n; t += 3) this.expandByPoint(Zn.fromArray(e, t));
		return this;
	}
	setFromBufferAttribute(e) {
		this.makeEmpty();
		for (let t = 0, n = e.count; t < n; t++) this.expandByPoint(Zn.fromBufferAttribute(e, t));
		return this;
	}
	setFromPoints(e) {
		this.makeEmpty();
		for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
		return this;
	}
	setFromCenterAndSize(e, t) {
		let n = Zn.copy(t).multiplyScalar(.5);
		return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
	}
	setFromObject(e, t = !1) {
		return this.makeEmpty(), this.expandByObject(e, t);
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.min.copy(e.min), this.max.copy(e.max), this;
	}
	makeEmpty() {
		return this.min.x = this.min.y = this.min.z = Infinity, this.max.x = this.max.y = this.max.z = -Infinity, this;
	}
	isEmpty() {
		return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
	}
	getCenter(e) {
		return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(.5);
	}
	getSize(e) {
		return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
	}
	expandByPoint(e) {
		return this.min.min(e), this.max.max(e), this;
	}
	expandByVector(e) {
		return this.min.sub(e), this.max.add(e), this;
	}
	expandByScalar(e) {
		return this.min.addScalar(-e), this.max.addScalar(e), this;
	}
	expandByObject(e, t = !1) {
		e.updateWorldMatrix(!1, !1);
		let n = e.geometry;
		if (n !== void 0) {
			let r = n.getAttribute("position");
			if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0) for (let t = 0, n = r.count; t < n; t++) e.isMesh === !0 ? e.getVertexPosition(t, Zn) : Zn.fromBufferAttribute(r, t), Zn.applyMatrix4(e.matrixWorld), this.expandByPoint(Zn);
			else e.boundingBox === void 0 ? (n.boundingBox === null && n.computeBoundingBox(), Qn.copy(n.boundingBox)) : (e.boundingBox === null && e.computeBoundingBox(), Qn.copy(e.boundingBox)), Qn.applyMatrix4(e.matrixWorld), this.union(Qn);
		}
		let r = e.children;
		for (let e = 0, n = r.length; e < n; e++) this.expandByObject(r[e], t);
		return this;
	}
	containsPoint(e) {
		return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
	}
	containsBox(e) {
		return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
	}
	getParameter(e, t) {
		return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
	}
	intersectsBox(e) {
		return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
	}
	intersectsSphere(e) {
		return this.clampPoint(e.center, Zn), Zn.distanceToSquared(e.center) <= e.radius * e.radius;
	}
	intersectsPlane(e) {
		let t, n;
		return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
	}
	intersectsTriangle(e) {
		if (this.isEmpty()) return !1;
		this.getCenter(ar), or.subVectors(this.max, ar), $n.subVectors(e.a, ar), er.subVectors(e.b, ar), tr.subVectors(e.c, ar), nr.subVectors(er, $n), rr.subVectors(tr, er), ir.subVectors($n, tr);
		let t = [
			0,
			-nr.z,
			nr.y,
			0,
			-rr.z,
			rr.y,
			0,
			-ir.z,
			ir.y,
			nr.z,
			0,
			-nr.x,
			rr.z,
			0,
			-rr.x,
			ir.z,
			0,
			-ir.x,
			-nr.y,
			nr.x,
			0,
			-rr.y,
			rr.x,
			0,
			-ir.y,
			ir.x,
			0
		];
		return !lr(t, $n, er, tr, or) || (t = [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		], !lr(t, $n, er, tr, or)) ? !1 : (sr.crossVectors(nr, rr), t = [
			sr.x,
			sr.y,
			sr.z
		], lr(t, $n, er, tr, or));
	}
	clampPoint(e, t) {
		return t.copy(e).clamp(this.min, this.max);
	}
	distanceToPoint(e) {
		return this.clampPoint(e, Zn).distanceTo(e);
	}
	getBoundingSphere(e) {
		return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(Zn).length() * .5), e;
	}
	intersect(e) {
		return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
	}
	union(e) {
		return this.min.min(e.min), this.max.max(e.max), this;
	}
	applyMatrix4(e) {
		return this.isEmpty() || (Xn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), Xn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), Xn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), Xn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), Xn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), Xn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), Xn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), Xn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(Xn)), this;
	}
	translate(e) {
		return this.min.add(e), this.max.add(e), this;
	}
	equals(e) {
		return e.min.equals(this.min) && e.max.equals(this.max);
	}
	toJSON() {
		return {
			min: this.min.toArray(),
			max: this.max.toArray()
		};
	}
	fromJSON(e) {
		return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
	}
}, Xn = [
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W()
], Zn = /*@__PURE__*/ new W(), Qn = /*@__PURE__*/ new Yn(), $n = /*@__PURE__*/ new W(), er = /*@__PURE__*/ new W(), tr = /*@__PURE__*/ new W(), nr = /*@__PURE__*/ new W(), rr = /*@__PURE__*/ new W(), ir = /*@__PURE__*/ new W(), ar = /*@__PURE__*/ new W(), or = /*@__PURE__*/ new W(), sr = /*@__PURE__*/ new W(), cr = /*@__PURE__*/ new W();
function lr(e, t, n, r, i) {
	for (let a = 0, o = e.length - 3; a <= o; a += 3) {
		cr.fromArray(e, a);
		let o = i.x * Math.abs(cr.x) + i.y * Math.abs(cr.y) + i.z * Math.abs(cr.z), s = t.dot(cr), c = n.dot(cr), l = r.dot(cr);
		if (Math.max(-Math.max(s, c, l), Math.min(s, c, l)) > o) return !1;
	}
	return !0;
}
var ur = /*@__PURE__*/ new W(), dr = /*@__PURE__*/ new U(), fr = 0, pr = class extends rt {
	constructor(e, t, n = !1) {
		if (super(), Array.isArray(e)) throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");
		this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: fr++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e === void 0 ? 0 : e.length / t, this.normalized = n, this.usage = Ge, this.updateRanges = [], this.gpuType = v, this.version = 0;
	}
	onUploadCallback() {}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
	setUsage(e) {
		return this.usage = e, this;
	}
	addUpdateRange(e, t) {
		this.updateRanges.push({
			start: e,
			count: t
		});
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0;
	}
	copy(e) {
		return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
	}
	copyAt(e, t, n) {
		e *= this.itemSize, n *= t.itemSize;
		for (let r = 0, i = this.itemSize; r < i; r++) this.array[e + r] = t.array[n + r];
		return this;
	}
	copyArray(e) {
		return this.array.set(e), this;
	}
	applyMatrix3(e) {
		if (this.itemSize === 2) for (let t = 0, n = this.count; t < n; t++) dr.fromBufferAttribute(this, t), dr.applyMatrix3(e), this.setXY(t, dr.x, dr.y);
		else if (this.itemSize === 3) for (let t = 0, n = this.count; t < n; t++) ur.fromBufferAttribute(this, t), ur.applyMatrix3(e), this.setXYZ(t, ur.x, ur.y, ur.z);
		return this;
	}
	applyMatrix4(e) {
		for (let t = 0, n = this.count; t < n; t++) ur.fromBufferAttribute(this, t), ur.applyMatrix4(e), this.setXYZ(t, ur.x, ur.y, ur.z);
		return this;
	}
	applyNormalMatrix(e) {
		for (let t = 0, n = this.count; t < n; t++) ur.fromBufferAttribute(this, t), ur.applyNormalMatrix(e), this.setXYZ(t, ur.x, ur.y, ur.z);
		return this;
	}
	transformDirection(e) {
		for (let t = 0, n = this.count; t < n; t++) ur.fromBufferAttribute(this, t), ur.transformDirection(e), this.setXYZ(t, ur.x, ur.y, ur.z);
		return this;
	}
	set(e, t = 0) {
		return this.array.set(e, t), this;
	}
	getComponent(e, t) {
		let n = this.array[e * this.itemSize + t];
		return this.normalized && (n = Dt(n, this.array)), n;
	}
	setComponent(e, t, n) {
		return this.normalized && (n = Ot(n, this.array)), this.array[e * this.itemSize + t] = n, this;
	}
	getX(e) {
		let t = this.array[e * this.itemSize];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	setX(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.array[e * this.itemSize] = t, this;
	}
	getY(e) {
		let t = this.array[e * this.itemSize + 1];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	setY(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
	}
	getZ(e) {
		let t = this.array[e * this.itemSize + 2];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	setZ(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
	}
	getW(e) {
		let t = this.array[e * this.itemSize + 3];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	setW(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
	}
	setXY(e, t, n) {
		return e *= this.itemSize, this.normalized && (t = Ot(t, this.array), n = Ot(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
	}
	setXYZ(e, t, n, r) {
		return e *= this.itemSize, this.normalized && (t = Ot(t, this.array), n = Ot(n, this.array), r = Ot(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this;
	}
	setXYZW(e, t, n, r, i) {
		return e *= this.itemSize, this.normalized && (t = Ot(t, this.array), n = Ot(n, this.array), r = Ot(r, this.array), i = Ot(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this.array[e + 3] = i, this;
	}
	onUpload(e) {
		return this.onUploadCallback = e, this;
	}
	clone() {
		return new this.constructor(this.array, this.itemSize).copy(this);
	}
	toJSON() {
		let e = {
			itemSize: this.itemSize,
			type: this.array.constructor.name,
			array: Array.from(this.array),
			normalized: this.normalized
		};
		return e.name = this.name, e.usage = this.usage, e.gpuType = this.gpuType, e;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}, mr = class extends pr {
	constructor(e, t, n) {
		super(new Uint16Array(e), t, n);
	}
}, hr = class extends pr {
	constructor(e, t, n) {
		super(new Uint32Array(e), t, n);
	}
}, gr = class extends pr {
	constructor(e, t, n) {
		super(new Float32Array(e), t, n);
	}
}, _r = /*@__PURE__*/ new Yn(), vr = /*@__PURE__*/ new W(), yr = /*@__PURE__*/ new W(), br = class {
	constructor(e = new W(), t = -1) {
		this.isSphere = !0, this.center = e, this.radius = t;
	}
	set(e, t) {
		return this.center.copy(e), this.radius = t, this;
	}
	setFromPoints(e, t) {
		let n = this.center;
		t === void 0 ? _r.setFromPoints(e).getCenter(n) : n.copy(t);
		let r = 0;
		for (let t = 0, i = e.length; t < i; t++) r = Math.max(r, n.distanceToSquared(e[t]));
		return this.radius = Math.sqrt(r), this;
	}
	copy(e) {
		return this.center.copy(e.center), this.radius = e.radius, this;
	}
	isEmpty() {
		return this.radius < 0;
	}
	makeEmpty() {
		return this.center.set(0, 0, 0), this.radius = -1, this;
	}
	containsPoint(e) {
		return e.distanceToSquared(this.center) <= this.radius * this.radius;
	}
	distanceToPoint(e) {
		return e.distanceTo(this.center) - this.radius;
	}
	intersectsSphere(e) {
		let t = this.radius + e.radius;
		return e.center.distanceToSquared(this.center) <= t * t;
	}
	intersectsBox(e) {
		return e.intersectsSphere(this);
	}
	intersectsPlane(e) {
		return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
	}
	clampPoint(e, t) {
		let n = this.center.distanceToSquared(e);
		return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
	}
	getBoundingBox(e) {
		return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
	}
	applyMatrix4(e) {
		return this.center.applyMatrix4(e), this.radius *= e.getMaxScaleOnAxis(), this;
	}
	translate(e) {
		return this.center.add(e), this;
	}
	expandByPoint(e) {
		if (this.isEmpty()) return this.center.copy(e), this.radius = 0, this;
		vr.subVectors(e, this.center);
		let t = vr.lengthSq();
		if (t > this.radius * this.radius) {
			let e = Math.sqrt(t), n = (e - this.radius) * .5;
			this.center.addScaledVector(vr, n / e), this.radius += n;
		}
		return this;
	}
	union(e) {
		return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (yr.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(vr.copy(e.center).add(yr)), this.expandByPoint(vr.copy(e.center).sub(yr))), this);
	}
	equals(e) {
		return e.center.equals(this.center) && e.radius === this.radius;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	toJSON() {
		return {
			radius: this.radius,
			center: this.center.toArray()
		};
	}
	fromJSON(e) {
		return this.radius = e.radius, this.center.fromArray(e.center), this;
	}
}, xr = 0, Sr = /*@__PURE__*/ new q(), Cr = /*@__PURE__*/ new Tn(), wr = /*@__PURE__*/ new W(), Tr = /*@__PURE__*/ new Yn(), Er = /*@__PURE__*/ new Yn(), Dr = /*@__PURE__*/ new W(), Or = class e extends rt {
	constructor() {
		super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: xr++ }), this.uuid = ct(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.indirectOffset = 0, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
			start: 0,
			count: Infinity
		}, this.userData = {}, this._transformed = !1;
	}
	getIndex() {
		return this.index;
	}
	setIndex(e) {
		return this.index = Array.isArray(e) ? new (qe(e) ? hr : mr)(e, 1) : e, this;
	}
	setIndirect(e, t = 0) {
		return this.indirect = e, this.indirectOffset = t, this;
	}
	getIndirect() {
		return this.indirect;
	}
	getAttribute(e) {
		return this.attributes[e];
	}
	setAttribute(e, t) {
		return this.attributes[e] = t, this;
	}
	deleteAttribute(e) {
		return delete this.attributes[e], this;
	}
	hasAttribute(e) {
		return this.attributes[e] !== void 0;
	}
	addGroup(e, t, n = 0) {
		this.groups.push({
			start: e,
			count: t,
			materialIndex: n
		});
	}
	clearGroups() {
		this.groups = [];
	}
	setDrawRange(e, t) {
		this.drawRange.start = e, this.drawRange.count = t;
	}
	applyMatrix4(e) {
		let t = this.attributes.position;
		t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
		let n = this.attributes.normal;
		if (n !== void 0) {
			let t = new G().getNormalMatrix(e);
			n.applyNormalMatrix(t), n.needsUpdate = !0;
		}
		let r = this.attributes.tangent;
		return r !== void 0 && (r.transformDirection(e), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this._transformed = !0, this;
	}
	applyQuaternion(e) {
		return Sr.makeRotationFromQuaternion(e), this.applyMatrix4(Sr), this;
	}
	rotateX(e) {
		return Sr.makeRotationX(e), this.applyMatrix4(Sr), this;
	}
	rotateY(e) {
		return Sr.makeRotationY(e), this.applyMatrix4(Sr), this;
	}
	rotateZ(e) {
		return Sr.makeRotationZ(e), this.applyMatrix4(Sr), this;
	}
	translate(e, t, n) {
		return Sr.makeTranslation(e, t, n), this.applyMatrix4(Sr), this;
	}
	scale(e, t, n) {
		return Sr.makeScale(e, t, n), this.applyMatrix4(Sr), this;
	}
	lookAt(e) {
		return Cr.lookAt(e), Cr.updateMatrix(), this.applyMatrix4(Cr.matrix), this;
	}
	center() {
		return this.computeBoundingBox(), this.boundingBox.getCenter(wr).negate(), this.translate(wr.x, wr.y, wr.z), this;
	}
	setFromPoints(e) {
		let t = this.getAttribute("position");
		if (t === void 0) {
			let t = [];
			for (let n = 0, r = e.length; n < r; n++) {
				let r = e[n];
				t.push(r.x, r.y, r.z || 0);
			}
			this.setAttribute("position", new gr(t, 3));
		} else {
			let n = Math.min(e.length, t.count);
			for (let r = 0; r < n; r++) {
				let n = e[r];
				t.setXYZ(r, n.x, n.y, n.z || 0);
			}
			e.length > t.count && B("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = !0;
		}
		return this;
	}
	computeBoundingBox() {
		this.boundingBox === null && (this.boundingBox = new Yn());
		let e = this.attributes.position, t = this.morphAttributes.position;
		if (e && e.isGLBufferAttribute) V("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new W(-Infinity, -Infinity, -Infinity), new W(Infinity, Infinity, Infinity));
		else {
			if (e !== void 0) {
				if (this.boundingBox.setFromBufferAttribute(e), t) for (let e = 0, n = t.length; e < n; e++) {
					let n = t[e];
					Tr.setFromBufferAttribute(n), this.morphTargetsRelative ? (Dr.addVectors(this.boundingBox.min, Tr.min), this.boundingBox.expandByPoint(Dr), Dr.addVectors(this.boundingBox.max, Tr.max), this.boundingBox.expandByPoint(Dr)) : (this.boundingBox.expandByPoint(Tr.min), this.boundingBox.expandByPoint(Tr.max));
				}
			} else this.boundingBox.makeEmpty();
			(isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && V("BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The \"position\" attribute is likely to have NaN values.", this);
		}
	}
	computeBoundingSphere() {
		this.boundingSphere === null && (this.boundingSphere = new br());
		let e = this.attributes.position, t = this.morphAttributes.position;
		if (e && e.isGLBufferAttribute) V("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new W(), Infinity);
		else if (e) {
			let n = this.boundingSphere.center;
			if (Tr.setFromBufferAttribute(e), t) for (let e = 0, n = t.length; e < n; e++) {
				let n = t[e];
				Er.setFromBufferAttribute(n), this.morphTargetsRelative ? (Dr.addVectors(Tr.min, Er.min), Tr.expandByPoint(Dr), Dr.addVectors(Tr.max, Er.max), Tr.expandByPoint(Dr)) : (Tr.expandByPoint(Er.min), Tr.expandByPoint(Er.max));
			}
			Tr.getCenter(n);
			let r = 0;
			for (let t = 0, i = e.count; t < i; t++) Dr.fromBufferAttribute(e, t), r = Math.max(r, n.distanceToSquared(Dr));
			if (t) for (let i = 0, a = t.length; i < a; i++) {
				let a = t[i], o = this.morphTargetsRelative;
				for (let t = 0, i = a.count; t < i; t++) Dr.fromBufferAttribute(a, t), o && (wr.fromBufferAttribute(e, t), Dr.add(wr)), r = Math.max(r, n.distanceToSquared(Dr));
			}
			this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && V("BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The \"position\" attribute is likely to have NaN values.", this);
		}
	}
	computeTangents() {
		let e = this.index, t = this.attributes;
		if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
			V("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
			return;
		}
		let n = t.position, r = t.normal, i = t.uv, a = this.getAttribute("tangent");
		(a === void 0 || a.count !== n.count) && (a = new pr(new Float32Array(4 * n.count), 4), this.setAttribute("tangent", a));
		let o = [], s = [];
		for (let e = 0; e < n.count; e++) o[e] = new W(), s[e] = new W();
		let c = new W(), l = new W(), u = new W(), d = new U(), f = new U(), p = new U(), m = new W(), h = new W();
		function g(e, t, r) {
			c.fromBufferAttribute(n, e), l.fromBufferAttribute(n, t), u.fromBufferAttribute(n, r), d.fromBufferAttribute(i, e), f.fromBufferAttribute(i, t), p.fromBufferAttribute(i, r), l.sub(c), u.sub(c), f.sub(d), p.sub(d);
			let a = 1 / (f.x * p.y - p.x * f.y);
			isFinite(a) && (m.copy(l).multiplyScalar(p.y).addScaledVector(u, -f.y).multiplyScalar(a), h.copy(u).multiplyScalar(f.x).addScaledVector(l, -p.x).multiplyScalar(a), o[e].add(m), o[t].add(m), o[r].add(m), s[e].add(h), s[t].add(h), s[r].add(h));
		}
		let _ = this.groups;
		_.length === 0 && (_ = [{
			start: 0,
			count: e.count
		}]);
		for (let t = 0, n = _.length; t < n; ++t) {
			let n = _[t], r = n.start, i = n.count;
			for (let t = r, n = r + i; t < n; t += 3) g(e.getX(t + 0), e.getX(t + 1), e.getX(t + 2));
		}
		let v = new W(), y = new W(), b = new W(), x = new W();
		function S(e) {
			b.fromBufferAttribute(r, e), x.copy(b);
			let t = o[e];
			v.copy(t), v.sub(b.multiplyScalar(b.dot(t))).normalize(), y.crossVectors(x, t);
			let n = y.dot(s[e]) < 0 ? -1 : 1;
			a.setXYZW(e, v.x, v.y, v.z, n);
		}
		for (let t = 0, n = _.length; t < n; ++t) {
			let n = _[t], r = n.start, i = n.count;
			for (let t = r, n = r + i; t < n; t += 3) S(e.getX(t + 0)), S(e.getX(t + 1)), S(e.getX(t + 2));
		}
		this._transformed = !0;
	}
	computeVertexNormals() {
		let e = this.index, t = this.getAttribute("position");
		if (t !== void 0) {
			let n = this.getAttribute("normal");
			if (n === void 0 || n.count !== t.count) n = new pr(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
			else for (let e = 0, t = n.count; e < t; e++) n.setXYZ(e, 0, 0, 0);
			let r = new W(), i = new W(), a = new W(), o = new W(), s = new W(), c = new W(), l = new W(), u = new W();
			if (e) for (let d = 0, f = e.count; d < f; d += 3) {
				let f = e.getX(d + 0), p = e.getX(d + 1), m = e.getX(d + 2);
				r.fromBufferAttribute(t, f), i.fromBufferAttribute(t, p), a.fromBufferAttribute(t, m), l.subVectors(a, i), u.subVectors(r, i), l.cross(u), o.fromBufferAttribute(n, f), s.fromBufferAttribute(n, p), c.fromBufferAttribute(n, m), o.add(l), s.add(l), c.add(l), n.setXYZ(f, o.x, o.y, o.z), n.setXYZ(p, s.x, s.y, s.z), n.setXYZ(m, c.x, c.y, c.z);
			}
			else for (let e = 0, o = t.count; e < o; e += 3) r.fromBufferAttribute(t, e + 0), i.fromBufferAttribute(t, e + 1), a.fromBufferAttribute(t, e + 2), l.subVectors(a, i), u.subVectors(r, i), l.cross(u), n.setXYZ(e + 0, l.x, l.y, l.z), n.setXYZ(e + 1, l.x, l.y, l.z), n.setXYZ(e + 2, l.x, l.y, l.z);
			this.normalizeNormals(), n.needsUpdate = !0;
		}
	}
	normalizeNormals() {
		let e = this.attributes.normal;
		for (let t = 0, n = e.count; t < n; t++) Dr.fromBufferAttribute(e, t), Dr.normalize(), e.setXYZ(t, Dr.x, Dr.y, Dr.z);
	}
	toNonIndexed() {
		function t(e, t) {
			let n = e.array, r = e.itemSize, i = e.normalized, a = new n.constructor(t.length * r), o = 0, s = 0;
			for (let i = 0, c = t.length; i < c; i++) {
				o = e.isInterleavedBufferAttribute ? t[i] * e.data.stride + e.offset : t[i] * r;
				for (let e = 0; e < r; e++) a[s++] = n[o++];
			}
			return new pr(a, r, i);
		}
		if (this.index === null) return B("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
		let n = new e(), r = this.index.array, i = this.attributes;
		for (let e in i) {
			let a = i[e], o = t(a, r);
			n.setAttribute(e, o);
		}
		let a = this.morphAttributes;
		for (let e in a) {
			let i = [], o = a[e];
			for (let e = 0, n = o.length; e < n; e++) {
				let n = o[e], a = t(n, r);
				i.push(a);
			}
			n.morphAttributes[e] = i;
		}
		n.morphTargetsRelative = this.morphTargetsRelative;
		let o = this.groups;
		for (let e = 0, t = o.length; e < t; e++) {
			let t = o[e];
			n.addGroup(t.start, t.count, t.materialIndex);
		}
		return n;
	}
	toJSON() {
		let e = { metadata: {
			version: 4.7,
			type: "BufferGeometry",
			generator: "BufferGeometry.toJSON"
		} };
		if (e.uuid = this.uuid, e.type = this.parameters !== void 0 && this._transformed === !0 ? "BufferGeometry" : this.type, e.name = this.name, Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0 && this._transformed !== !0) {
			let t = this.parameters;
			for (let n in t) t[n] !== void 0 && (e[n] = t[n]);
			return e;
		}
		e.data = { attributes: {} };
		let t = this.index;
		t !== null && (e.data.index = {
			type: t.array.constructor.name,
			array: Array.prototype.slice.call(t.array)
		});
		let n = this.attributes;
		for (let t in n) {
			let r = n[t];
			e.data.attributes[t] = r.toJSON(e.data);
		}
		let r = {}, i = !1;
		for (let t in this.morphAttributes) {
			let n = this.morphAttributes[t], a = [];
			for (let t = 0, r = n.length; t < r; t++) {
				let r = n[t];
				a.push(r.toJSON(e.data));
			}
			a.length > 0 && (r[t] = a, i = !0);
		}
		i && (e.data.morphAttributes = r, e.data.morphTargetsRelative = this.morphTargetsRelative);
		let a = this.groups;
		a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
		let o = this.boundingSphere;
		return o !== null && (e.data.boundingSphere = o.toJSON()), e;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
		let t = {};
		this.name = e.name;
		let n = e.index;
		n !== null && this.setIndex(n.clone());
		let r = e.attributes;
		for (let e in r) {
			let n = r[e];
			this.setAttribute(e, n.clone(t));
		}
		let i = e.morphAttributes;
		for (let e in i) {
			let n = [], r = i[e];
			for (let e = 0, i = r.length; e < i; e++) n.push(r[e].clone(t));
			this.morphAttributes[e] = n;
		}
		this.morphTargetsRelative = e.morphTargetsRelative;
		let a = e.groups;
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e];
			this.addGroup(t.start, t.count, t.materialIndex);
		}
		let o = e.boundingBox;
		o !== null && (this.boundingBox = o.clone());
		let s = e.boundingSphere;
		return s !== null && (this.boundingSphere = s.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this._transformed = e._transformed, this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}, kr = class {
	constructor(e, t) {
		this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e === void 0 ? 0 : e.length / t, this.usage = Ge, this.updateRanges = [], this.version = 0, this.uuid = ct();
	}
	onUploadCallback() {}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
	setUsage(e) {
		return this.usage = e, this;
	}
	addUpdateRange(e, t) {
		this.updateRanges.push({
			start: e,
			count: t
		});
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0;
	}
	copy(e) {
		return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
	}
	copyAt(e, t, n) {
		e *= this.stride, n *= t.stride;
		for (let r = 0, i = this.stride; r < i; r++) this.array[e + r] = t.array[n + r];
		return this;
	}
	set(e, t = 0) {
		return this.array.set(e, t), this;
	}
	clone(e) {
		e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = ct()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
		let t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
		return n.setUsage(this.usage), n;
	}
	onUpload(e) {
		return this.onUploadCallback = e, this;
	}
	toJSON(e) {
		e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = ct()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer)));
		let t = {
			uuid: this.uuid,
			buffer: this.array.buffer._uuid,
			type: this.array.constructor.name,
			stride: this.stride
		};
		return t.usage = this.usage, t;
	}
}, Ar = /*@__PURE__*/ new W(), jr = class e {
	constructor(e, t, n, r = !1) {
		this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = r;
	}
	get count() {
		return this.data.count;
	}
	get array() {
		return this.data.array;
	}
	set needsUpdate(e) {
		this.data.needsUpdate = e;
	}
	applyMatrix4(e) {
		for (let t = 0, n = this.data.count; t < n; t++) Ar.fromBufferAttribute(this, t), Ar.applyMatrix4(e), this.setXYZ(t, Ar.x, Ar.y, Ar.z);
		return this;
	}
	applyNormalMatrix(e) {
		for (let t = 0, n = this.count; t < n; t++) Ar.fromBufferAttribute(this, t), Ar.applyNormalMatrix(e), this.setXYZ(t, Ar.x, Ar.y, Ar.z);
		return this;
	}
	transformDirection(e) {
		for (let t = 0, n = this.count; t < n; t++) Ar.fromBufferAttribute(this, t), Ar.transformDirection(e), this.setXYZ(t, Ar.x, Ar.y, Ar.z);
		return this;
	}
	getComponent(e, t) {
		let n = this.array[e * this.data.stride + this.offset + t];
		return this.normalized && (n = Dt(n, this.array)), n;
	}
	setComponent(e, t, n) {
		return this.normalized && (n = Ot(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
	}
	setX(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
	}
	setY(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
	}
	setZ(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
	}
	setW(e, t) {
		return this.normalized && (t = Ot(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
	}
	getX(e) {
		let t = this.data.array[e * this.data.stride + this.offset];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	getY(e) {
		let t = this.data.array[e * this.data.stride + this.offset + 1];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	getZ(e) {
		let t = this.data.array[e * this.data.stride + this.offset + 2];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	getW(e) {
		let t = this.data.array[e * this.data.stride + this.offset + 3];
		return this.normalized && (t = Dt(t, this.array)), t;
	}
	setXY(e, t, n) {
		return e = e * this.data.stride + this.offset, this.normalized && (t = Ot(t, this.array), n = Ot(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
	}
	setXYZ(e, t, n, r) {
		return e = e * this.data.stride + this.offset, this.normalized && (t = Ot(t, this.array), n = Ot(n, this.array), r = Ot(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this;
	}
	setXYZW(e, t, n, r, i) {
		return e = e * this.data.stride + this.offset, this.normalized && (t = Ot(t, this.array), n = Ot(n, this.array), r = Ot(r, this.array), i = Ot(i, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this.data.array[e + 3] = i, this;
	}
	clone(t) {
		if (t === void 0) {
			Qe("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
			let e = [];
			for (let t = 0; t < this.count; t++) {
				let n = t * this.data.stride + this.offset;
				for (let t = 0; t < this.itemSize; t++) e.push(this.data.array[n + t]);
			}
			return new pr(new this.array.constructor(e), this.itemSize, this.normalized);
		}
		return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new e(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
	}
	toJSON(e) {
		if (e === void 0) {
			Qe("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
			let e = [];
			for (let t = 0; t < this.count; t++) {
				let n = t * this.data.stride + this.offset;
				for (let t = 0; t < this.itemSize; t++) e.push(this.data.array[n + t]);
			}
			return {
				itemSize: this.itemSize,
				type: this.array.constructor.name,
				array: e,
				normalized: this.normalized
			};
		}
		return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
			isInterleavedBufferAttribute: !0,
			itemSize: this.itemSize,
			data: this.data.uuid,
			offset: this.offset,
			normalized: this.normalized
		};
	}
}, Mr = /*@__PURE__*/ new W(), Nr = /*@__PURE__*/ new W(), Pr = /*@__PURE__*/ new G(), Fr = class {
	constructor(e = new W(1, 0, 0), t = 0) {
		this.isPlane = !0, this.normal = e, this.constant = t;
	}
	set(e, t) {
		return this.normal.copy(e), this.constant = t, this;
	}
	setComponents(e, t, n, r) {
		return this.normal.set(e, t, n), this.constant = r, this;
	}
	setFromNormalAndCoplanarPoint(e, t) {
		return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
	}
	setFromCoplanarPoints(e, t, n) {
		let r = Mr.subVectors(n, t).cross(Nr.subVectors(e, t)).normalize();
		return this.setFromNormalAndCoplanarPoint(r, e), this;
	}
	copy(e) {
		return this.normal.copy(e.normal), this.constant = e.constant, this;
	}
	normalize() {
		let e = 1 / this.normal.length();
		return this.normal.multiplyScalar(e), this.constant *= e, this;
	}
	negate() {
		return this.constant *= -1, this.normal.negate(), this;
	}
	distanceToPoint(e) {
		return this.normal.dot(e) + this.constant;
	}
	distanceToSphere(e) {
		return this.distanceToPoint(e.center) - e.radius;
	}
	projectPoint(e, t) {
		return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
	}
	intersectLine(e, t, n = !0) {
		let r = e.delta(Mr), i = this.normal.dot(r);
		if (i === 0) return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
		let a = -(e.start.dot(this.normal) + this.constant) / i;
		return n === !0 && (a < 0 || a > 1) ? null : t.copy(e.start).addScaledVector(r, a);
	}
	intersectsLine(e) {
		let t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
		return t < 0 && n > 0 || n < 0 && t > 0;
	}
	intersectsBox(e) {
		return e.intersectsPlane(this);
	}
	intersectsSphere(e) {
		return e.intersectsPlane(this);
	}
	coplanarPoint(e) {
		return e.copy(this.normal).multiplyScalar(-this.constant);
	}
	applyMatrix4(e, t) {
		let n = t || Pr.getNormalMatrix(e), r = this.coplanarPoint(Mr).applyMatrix4(e), i = this.normal.applyMatrix3(n).normalize();
		return this.constant = -r.dot(i), this;
	}
	translate(e) {
		return this.constant -= e.dot(this.normal), this;
	}
	equals(e) {
		return e.normal.equals(this.normal) && e.constant === this.constant;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	toJSON() {
		return {
			normal: this.normal.toArray(),
			constant: this.constant
		};
	}
	fromJSON(e) {
		return this.normal.fromArray(e.normal), this.constant = e.constant, this;
	}
}, Ir = 0, Lr = class extends rt {
	constructor() {
		super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Ir++ }), this.uuid = ct(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new J(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = We, this.stencilZFail = We, this.stencilZPass = We, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
	}
	get alphaTest() {
		return this._alphaTest;
	}
	set alphaTest(e) {
		this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
	}
	onBeforeRender() {}
	onBeforeCompile() {}
	customProgramCacheKey() {
		return this.onBeforeCompile.toString();
	}
	setValues(e) {
		if (e !== void 0) for (let t in e) {
			let n = e[t];
			if (n === void 0) {
				B(`Material: parameter '${t}' has value of undefined.`);
				continue;
			}
			let r = this[t];
			r === void 0 ? B(`Material: '${t}' is not a property of THREE.${this.type}.`) : r && r.isColor ? r.set(n) : r && r.isVector2 && n && n.isVector2 || r && r.isEuler && n && n.isEuler || r && r.isVector3 && n && n.isVector3 ? r.copy(n) : this[t] = n;
		}
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string";
		t && (e = {
			textures: {},
			images: {}
		});
		let n = { metadata: {
			version: 4.7,
			type: "Material",
			generator: "Material.toJSON"
		} };
		n.uuid = this.uuid, n.type = this.type, n.blending = this.blending, n.side = this.side, n.shadowSide = this.shadowSide, n.vertexColors = this.vertexColors, n.opacity = this.opacity, n.transparent = this.transparent, n.blendSrc = this.blendSrc, n.blendDst = this.blendDst, n.blendEquation = this.blendEquation, n.blendSrcAlpha = this.blendSrcAlpha, n.blendDstAlpha = this.blendDstAlpha, n.blendEquationAlpha = this.blendEquationAlpha, n.blendColor = this.blendColor.getHex(), n.blendAlpha = this.blendAlpha, n.depthFunc = this.depthFunc, n.depthTest = this.depthTest, n.depthWrite = this.depthWrite, n.colorWrite = this.colorWrite, n.clipIntersection = this.clipIntersection, n.clipShadows = this.clipShadows, n.stencilWriteMask = this.stencilWriteMask, n.stencilFunc = this.stencilFunc, n.stencilRef = this.stencilRef, n.stencilFuncMask = this.stencilFuncMask, n.stencilFail = this.stencilFail, n.stencilZFail = this.stencilZFail, n.stencilZPass = this.stencilZPass, n.stencilWrite = this.stencilWrite, n.polygonOffset = this.polygonOffset, n.polygonOffsetFactor = this.polygonOffsetFactor, n.polygonOffsetUnits = this.polygonOffsetUnits, n.dithering = this.dithering, n.alphaTest = this.alphaTest, n.alphaHash = this.alphaHash, n.alphaToCoverage = this.alphaToCoverage, n.premultipliedAlpha = this.premultipliedAlpha, n.forceSinglePass = this.forceSinglePass, n.allowOverride = this.allowOverride, n.visible = this.visible, n.toneMapped = this.toneMapped, n.name = this.name, this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.retroreflectivity !== void 0 && (n.retroreflectivity = this.retroreflectivity), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), Array.isArray(this.clippingPlanes) && this.clippingPlanes.length > 0 && (n.clippingPlanes = this.clippingPlanes.map((e) => e.toJSON())), this.rotation !== void 0 && (n.rotation = this.rotation), this.depthPacking !== void 0 && (n.depthPacking = this.depthPacking), this.linewidth !== void 0 && (n.linewidth = this.linewidth), this.linecap !== void 0 && (n.linecap = this.linecap), this.linejoin !== void 0 && (n.linejoin = this.linejoin), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.wireframe !== void 0 && (n.wireframe = this.wireframe), this.wireframeLinewidth !== void 0 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== void 0 && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== void 0 && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading !== void 0 && (n.flatShading = this.flatShading), this.fog !== void 0 && (n.fog = this.fog), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
		function r(e) {
			let t = [];
			for (let n in e) {
				let r = e[n];
				delete r.metadata, t.push(r);
			}
			return t;
		}
		if (t) {
			let t = r(e.textures), i = r(e.images);
			t.length > 0 && (n.textures = t), i.length > 0 && (n.images = i);
		}
		return n;
	}
	fromJSON(e, t) {
		if (e.uuid !== void 0 && (this.uuid = e.uuid), e.name !== void 0 && (this.name = e.name), e.color !== void 0 && this.color !== void 0 && this.color.setHex(e.color), e.roughness !== void 0 && (this.roughness = e.roughness), e.metalness !== void 0 && (this.metalness = e.metalness), e.sheen !== void 0 && (this.sheen = e.sheen), e.sheenColor !== void 0 && (this.sheenColor = new J().setHex(e.sheenColor)), e.sheenRoughness !== void 0 && (this.sheenRoughness = e.sheenRoughness), e.emissive !== void 0 && this.emissive !== void 0 && this.emissive.setHex(e.emissive), e.specular !== void 0 && this.specular !== void 0 && this.specular.setHex(e.specular), e.specularIntensity !== void 0 && (this.specularIntensity = e.specularIntensity), e.specularColor !== void 0 && this.specularColor !== void 0 && this.specularColor.setHex(e.specularColor), e.shininess !== void 0 && (this.shininess = e.shininess), e.clearcoat !== void 0 && (this.clearcoat = e.clearcoat), e.clearcoatRoughness !== void 0 && (this.clearcoatRoughness = e.clearcoatRoughness), e.dispersion !== void 0 && (this.dispersion = e.dispersion), e.retroreflectivity !== void 0 && (this.retroreflectivity = e.retroreflectivity), e.iridescence !== void 0 && (this.iridescence = e.iridescence), e.iridescenceIOR !== void 0 && (this.iridescenceIOR = e.iridescenceIOR), e.iridescenceThicknessRange !== void 0 && (this.iridescenceThicknessRange = e.iridescenceThicknessRange), e.transmission !== void 0 && (this.transmission = e.transmission), e.thickness !== void 0 && (this.thickness = e.thickness), e.attenuationDistance !== void 0 && (this.attenuationDistance = e.attenuationDistance), e.attenuationColor !== void 0 && this.attenuationColor !== void 0 && this.attenuationColor.setHex(e.attenuationColor), e.anisotropy !== void 0 && (this.anisotropy = e.anisotropy), e.anisotropyRotation !== void 0 && (this.anisotropyRotation = e.anisotropyRotation), e.fog !== void 0 && (this.fog = e.fog), e.flatShading !== void 0 && (this.flatShading = e.flatShading), e.blending !== void 0 && (this.blending = e.blending), e.combine !== void 0 && (this.combine = e.combine), e.side !== void 0 && (this.side = e.side), e.shadowSide !== void 0 && (this.shadowSide = e.shadowSide), e.opacity !== void 0 && (this.opacity = e.opacity), e.transparent !== void 0 && (this.transparent = e.transparent), e.alphaTest !== void 0 && (this.alphaTest = e.alphaTest), e.alphaHash !== void 0 && (this.alphaHash = e.alphaHash), e.depthFunc !== void 0 && (this.depthFunc = e.depthFunc), e.depthTest !== void 0 && (this.depthTest = e.depthTest), e.depthWrite !== void 0 && (this.depthWrite = e.depthWrite), e.colorWrite !== void 0 && (this.colorWrite = e.colorWrite), e.clippingPlanes !== void 0 && (this.clippingPlanes = e.clippingPlanes.map((e) => new Fr().fromJSON(e))), e.clipIntersection !== void 0 && (this.clipIntersection = e.clipIntersection), e.clipShadows !== void 0 && (this.clipShadows = e.clipShadows), e.depthPacking !== void 0 && (this.depthPacking = e.depthPacking), e.blendSrc !== void 0 && (this.blendSrc = e.blendSrc), e.blendDst !== void 0 && (this.blendDst = e.blendDst), e.blendEquation !== void 0 && (this.blendEquation = e.blendEquation), e.blendSrcAlpha !== void 0 && (this.blendSrcAlpha = e.blendSrcAlpha), e.blendDstAlpha !== void 0 && (this.blendDstAlpha = e.blendDstAlpha), e.blendEquationAlpha !== void 0 && (this.blendEquationAlpha = e.blendEquationAlpha), e.blendColor !== void 0 && this.blendColor !== void 0 && this.blendColor.setHex(e.blendColor), e.blendAlpha !== void 0 && (this.blendAlpha = e.blendAlpha), e.stencilWriteMask !== void 0 && (this.stencilWriteMask = e.stencilWriteMask), e.stencilFunc !== void 0 && (this.stencilFunc = e.stencilFunc), e.stencilRef !== void 0 && (this.stencilRef = e.stencilRef), e.stencilFuncMask !== void 0 && (this.stencilFuncMask = e.stencilFuncMask), e.stencilFail !== void 0 && (this.stencilFail = e.stencilFail), e.stencilZFail !== void 0 && (this.stencilZFail = e.stencilZFail), e.stencilZPass !== void 0 && (this.stencilZPass = e.stencilZPass), e.stencilWrite !== void 0 && (this.stencilWrite = e.stencilWrite), e.wireframe !== void 0 && (this.wireframe = e.wireframe), e.wireframeLinewidth !== void 0 && (this.wireframeLinewidth = e.wireframeLinewidth), e.wireframeLinecap !== void 0 && (this.wireframeLinecap = e.wireframeLinecap), e.wireframeLinejoin !== void 0 && (this.wireframeLinejoin = e.wireframeLinejoin), e.rotation !== void 0 && (this.rotation = e.rotation), e.linewidth !== void 0 && (this.linewidth = e.linewidth), e.linecap !== void 0 && (this.linecap = e.linecap), e.linejoin !== void 0 && (this.linejoin = e.linejoin), e.dashSize !== void 0 && (this.dashSize = e.dashSize), e.gapSize !== void 0 && (this.gapSize = e.gapSize), e.scale !== void 0 && (this.scale = e.scale), e.polygonOffset !== void 0 && (this.polygonOffset = e.polygonOffset), e.polygonOffsetFactor !== void 0 && (this.polygonOffsetFactor = e.polygonOffsetFactor), e.polygonOffsetUnits !== void 0 && (this.polygonOffsetUnits = e.polygonOffsetUnits), e.dithering !== void 0 && (this.dithering = e.dithering), e.alphaToCoverage !== void 0 && (this.alphaToCoverage = e.alphaToCoverage), e.premultipliedAlpha !== void 0 && (this.premultipliedAlpha = e.premultipliedAlpha), e.forceSinglePass !== void 0 && (this.forceSinglePass = e.forceSinglePass), e.allowOverride !== void 0 && (this.allowOverride = e.allowOverride), e.visible !== void 0 && (this.visible = e.visible), e.toneMapped !== void 0 && (this.toneMapped = e.toneMapped), e.userData !== void 0 && (this.userData = e.userData), e.vertexColors !== void 0 && (this.vertexColors = typeof e.vertexColors == "number" ? e.vertexColors > 0 : e.vertexColors), e.size !== void 0 && (this.size = e.size), e.sizeAttenuation !== void 0 && (this.sizeAttenuation = e.sizeAttenuation), e.map !== void 0 && (this.map = t[e.map] || null), e.matcap !== void 0 && (this.matcap = t[e.matcap] || null), e.alphaMap !== void 0 && (this.alphaMap = t[e.alphaMap] || null), e.bumpMap !== void 0 && (this.bumpMap = t[e.bumpMap] || null), e.bumpScale !== void 0 && (this.bumpScale = e.bumpScale), e.normalMap !== void 0 && (this.normalMap = t[e.normalMap] || null), e.normalMapType !== void 0 && (this.normalMapType = e.normalMapType), e.normalScale !== void 0) {
			let t = e.normalScale;
			Array.isArray(t) === !1 && (t = [t, t]), this.normalScale = new U().fromArray(t);
		}
		return e.displacementMap !== void 0 && (this.displacementMap = t[e.displacementMap] || null), e.displacementScale !== void 0 && (this.displacementScale = e.displacementScale), e.displacementBias !== void 0 && (this.displacementBias = e.displacementBias), e.roughnessMap !== void 0 && (this.roughnessMap = t[e.roughnessMap] || null), e.metalnessMap !== void 0 && (this.metalnessMap = t[e.metalnessMap] || null), e.emissiveMap !== void 0 && (this.emissiveMap = t[e.emissiveMap] || null), e.emissiveIntensity !== void 0 && (this.emissiveIntensity = e.emissiveIntensity), e.specularMap !== void 0 && (this.specularMap = t[e.specularMap] || null), e.specularIntensityMap !== void 0 && (this.specularIntensityMap = t[e.specularIntensityMap] || null), e.specularColorMap !== void 0 && (this.specularColorMap = t[e.specularColorMap] || null), e.envMap !== void 0 && (this.envMap = t[e.envMap] || null), e.envMapRotation !== void 0 && this.envMapRotation.fromArray(e.envMapRotation), e.envMapIntensity !== void 0 && (this.envMapIntensity = e.envMapIntensity), e.reflectivity !== void 0 && (this.reflectivity = e.reflectivity), e.refractionRatio !== void 0 && (this.refractionRatio = e.refractionRatio), e.lightMap !== void 0 && (this.lightMap = t[e.lightMap] || null), e.lightMapIntensity !== void 0 && (this.lightMapIntensity = e.lightMapIntensity), e.aoMap !== void 0 && (this.aoMap = t[e.aoMap] || null), e.aoMapIntensity !== void 0 && (this.aoMapIntensity = e.aoMapIntensity), e.gradientMap !== void 0 && (this.gradientMap = t[e.gradientMap] || null), e.clearcoatMap !== void 0 && (this.clearcoatMap = t[e.clearcoatMap] || null), e.clearcoatRoughnessMap !== void 0 && (this.clearcoatRoughnessMap = t[e.clearcoatRoughnessMap] || null), e.clearcoatNormalMap !== void 0 && (this.clearcoatNormalMap = t[e.clearcoatNormalMap] || null), e.clearcoatNormalScale !== void 0 && (this.clearcoatNormalScale = new U().fromArray(e.clearcoatNormalScale)), e.iridescenceMap !== void 0 && (this.iridescenceMap = t[e.iridescenceMap] || null), e.iridescenceThicknessMap !== void 0 && (this.iridescenceThicknessMap = t[e.iridescenceThicknessMap] || null), e.transmissionMap !== void 0 && (this.transmissionMap = t[e.transmissionMap] || null), e.thicknessMap !== void 0 && (this.thicknessMap = t[e.thicknessMap] || null), e.anisotropyMap !== void 0 && (this.anisotropyMap = t[e.anisotropyMap] || null), e.sheenColorMap !== void 0 && (this.sheenColorMap = t[e.sheenColorMap] || null), e.sheenRoughnessMap !== void 0 && (this.sheenRoughnessMap = t[e.sheenRoughnessMap] || null), this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
		let t = e.clippingPlanes, n = null;
		if (t !== null) {
			let e = t.length;
			n = Array(e);
			for (let r = 0; r !== e; ++r) n[r] = t[r].clone();
		}
		return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.allowOverride = e.allowOverride, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
}, Rr = /*@__PURE__*/ new W(), zr = /*@__PURE__*/ new W(), Br = /*@__PURE__*/ new W(), Vr = /*@__PURE__*/ new W(), Hr = class {
	constructor(e = new W(), t = new W(0, 0, -1)) {
		this.origin = e, this.direction = t;
	}
	set(e, t) {
		return this.origin.copy(e), this.direction.copy(t), this;
	}
	copy(e) {
		return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
	}
	at(e, t) {
		return t.copy(this.origin).addScaledVector(this.direction, e);
	}
	lookAt(e) {
		return this.direction.copy(e).sub(this.origin).normalize(), this;
	}
	recast(e) {
		return this.origin.copy(this.at(e, Rr)), this;
	}
	closestPointToPoint(e, t) {
		t.subVectors(e, this.origin);
		let n = t.dot(this.direction);
		return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
	}
	distanceToPoint(e) {
		return Math.sqrt(this.distanceSqToPoint(e));
	}
	distanceSqToPoint(e) {
		let t = Rr.subVectors(e, this.origin).dot(this.direction);
		return t < 0 ? this.origin.distanceToSquared(e) : (Rr.copy(this.origin).addScaledVector(this.direction, t), Rr.distanceToSquared(e));
	}
	distanceSqToSegment(e, t, n, r) {
		zr.copy(e).add(t).multiplyScalar(.5), Br.copy(t).sub(e).normalize(), Vr.copy(this.origin).sub(zr);
		let i = e.distanceTo(t) * .5, a = -this.direction.dot(Br), o = Vr.dot(this.direction), s = -Vr.dot(Br), c = Vr.lengthSq(), l = Math.abs(1 - a * a), u, d, f, p;
		if (l > 0) {
			if (u = a * s - o, d = a * o - s, p = i * l, u >= 0) {
				if (d >= -p) {
					if (d <= p) {
						let e = 1 / l;
						u *= e, d *= e, f = u * (u + a * d + 2 * o) + d * (a * u + d + 2 * s) + c;
					} else d = i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
				} else d = -i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
			} else d <= -p ? (u = Math.max(0, -(-a * i + o)), d = u > 0 ? -i : Math.min(Math.max(-i, -s), i), f = -u * u + d * (d + 2 * s) + c) : d <= p ? (u = 0, d = Math.min(Math.max(-i, -s), i), f = d * (d + 2 * s) + c) : (u = Math.max(0, -(a * i + o)), d = u > 0 ? i : Math.min(Math.max(-i, -s), i), f = -u * u + d * (d + 2 * s) + c);
		} else d = a > 0 ? -i : i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
		return n && n.copy(this.origin).addScaledVector(this.direction, u), r && r.copy(zr).addScaledVector(Br, d), f;
	}
	intersectSphere(e, t) {
		if (e.radius < 0) return null;
		Rr.subVectors(e.center, this.origin);
		let n = Rr.dot(this.direction), r = Rr.dot(Rr) - n * n, i = e.radius * e.radius;
		if (r > i) return null;
		let a = Math.sqrt(i - r), o = n - a, s = n + a;
		return s < 0 ? null : o < 0 ? this.at(s, t) : this.at(o, t);
	}
	intersectsSphere(e) {
		return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
	}
	distanceToPlane(e) {
		let t = e.normal.dot(this.direction);
		if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
		let n = -(this.origin.dot(e.normal) + e.constant) / t;
		return n >= 0 ? n : null;
	}
	intersectPlane(e, t) {
		let n = this.distanceToPlane(e);
		return n === null ? null : this.at(n, t);
	}
	intersectsPlane(e) {
		let t = e.distanceToPoint(this.origin);
		return t === 0 || e.normal.dot(this.direction) * t < 0;
	}
	intersectBox(e, t) {
		let n, r, i, a, o, s, c = 1 / this.direction.x, l = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
		return c >= 0 ? (n = (e.min.x - d.x) * c, r = (e.max.x - d.x) * c) : (n = (e.max.x - d.x) * c, r = (e.min.x - d.x) * c), l >= 0 ? (i = (e.min.y - d.y) * l, a = (e.max.y - d.y) * l) : (i = (e.max.y - d.y) * l, a = (e.min.y - d.y) * l), n > a || i > r || ((i > n || isNaN(n)) && (n = i), (a < r || isNaN(r)) && (r = a), u >= 0 ? (o = (e.min.z - d.z) * u, s = (e.max.z - d.z) * u) : (o = (e.max.z - d.z) * u, s = (e.min.z - d.z) * u), n > s || o > r) || ((o > n || n !== n) && (n = o), (s < r || r !== r) && (r = s), r < 0) ? null : this.at(n >= 0 ? n : r, t);
	}
	intersectsBox(e) {
		return this.intersectBox(e, Rr) !== null;
	}
	intersectTriangle(e, t, n, r, i) {
		let a = this.origin, o = this.direction, s = o.x, c = o.y, l = o.z, u = e.x - a.x, d = e.y - a.y, f = e.z - a.z, p = t.x - a.x, m = t.y - a.y, h = t.z - a.z, g = n.x - a.x, _ = n.y - a.y, v = n.z - a.z, y = Math.abs(s), b = Math.abs(c), x = Math.abs(l), S, C, w, T, E, D, O, k, A, j, ee, te;
		if (y >= b && y >= x ? (w = s, D = u, A = p, te = g, s >= 0 ? (S = c, C = l, T = d, E = f, O = m, k = h, j = _, ee = v) : (S = l, C = c, T = f, E = d, O = h, k = m, j = v, ee = _)) : b >= x ? (w = c, D = d, A = m, te = _, c >= 0 ? (S = l, C = s, T = f, E = u, O = h, k = p, j = v, ee = g) : (S = s, C = l, T = u, E = f, O = p, k = h, j = g, ee = v)) : (w = l, D = f, A = h, te = v, l >= 0 ? (S = s, C = c, T = u, E = d, O = p, k = m, j = g, ee = _) : (S = c, C = s, T = d, E = u, O = m, k = p, j = _, ee = g)), w === 0) return null;
		let M = S / w, ne = C / w, N = 1 / w, re = T - M * D, P = E - ne * D, ie = O - M * A, ae = k - ne * A, oe = j - M * te, se = ee - ne * te, ce = oe * ae - se * ie, F = re * se - P * oe, le = ie * P - ae * re;
		if (r) {
			if (ce < 0 || F < 0 || le < 0) return null;
		} else if ((ce < 0 || F < 0 || le < 0) && (ce > 0 || F > 0 || le > 0)) return null;
		let ue = ce + F + le;
		if (ue === 0) return null;
		let de = N * (ce * D + F * A + le * te);
		return (ue > 0 ? de < 0 : de > 0) ? null : this.at(de / ue, i);
	}
	applyMatrix4(e) {
		return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
	}
	equals(e) {
		return e.origin.equals(this.origin) && e.direction.equals(this.direction);
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, Ur = class extends Lr {
	constructor(e) {
		super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new J(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new cn(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
	}
}, Wr = /*@__PURE__*/ new q(), Gr = /*@__PURE__*/ new Hr(), Kr = /*@__PURE__*/ new br(), qr = /*@__PURE__*/ new W(), Jr = /*@__PURE__*/ new W(), Yr = /*@__PURE__*/ new W(), Xr = /*@__PURE__*/ new W(), Zr = /*@__PURE__*/ new W(), Qr = /*@__PURE__*/ new W(), $r = /*@__PURE__*/ new W(), ei = /*@__PURE__*/ new W(), ti = class extends Tn {
	constructor(e = new Or(), t = new Ur()) {
		super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
	}
	copy(e, t) {
		return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
	}
	updateMorphTargets() {
		let e = this.geometry.morphAttributes, t = Object.keys(e);
		if (t.length > 0) {
			let n = e[t[0]];
			if (n !== void 0) {
				this.morphTargetInfluences = [], this.morphTargetDictionary = {};
				for (let e = 0, t = n.length; e < t; e++) {
					let t = n[e].name || String(e);
					this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
				}
			}
		}
	}
	getVertexPosition(e, t) {
		let n = this.geometry, r = n.attributes.position, i = n.morphAttributes.position, a = n.morphTargetsRelative;
		t.fromBufferAttribute(r, e);
		let o = this.morphTargetInfluences;
		if (i && o) {
			Qr.set(0, 0, 0);
			for (let n = 0, r = i.length; n < r; n++) {
				let r = o[n], s = i[n];
				r !== 0 && (Zr.fromBufferAttribute(s, e), a ? Qr.addScaledVector(Zr, r) : Qr.addScaledVector(Zr.sub(t), r));
			}
			t.add(Qr);
		}
		return t;
	}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	raycast(e, t) {
		let n = this.geometry, r = this.material, i = this.matrixWorld;
		r !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), Kr.copy(n.boundingSphere), Kr.applyMatrix4(i), Gr.copy(e.ray).recast(e.near), !(Kr.containsPoint(Gr.origin) === !1 && (Gr.intersectSphere(Kr, qr) === null || Gr.origin.distanceToSquared(qr) > (e.far - e.near) ** 2)) && (Wr.copy(i).invert(), Gr.copy(e.ray).applyMatrix4(Wr), (n.boundingBox === null || Gr.intersectsBox(n.boundingBox) !== !1) && this._computeIntersections(e, t, Gr)));
	}
	_computeIntersections(e, t, n) {
		let r, i = this.geometry, a = this.material, o = i.index, s = i.attributes.position, c = i.attributes.uv, l = i.attributes.uv1, u = i.attributes.normal, d = i.groups, f = i.drawRange;
		if (o !== null) {
			if (Array.isArray(a)) for (let i = 0, s = d.length; i < s; i++) {
				let s = d[i], p = a[s.materialIndex], m = Math.max(s.start, f.start), h = Math.min(o.count, Math.min(s.start + s.count, f.start + f.count));
				for (let i = m, a = h; i < a; i += 3) {
					let a = o.getX(i), d = o.getX(i + 1), f = o.getX(i + 2);
					r = ri(this, p, e, n, c, l, u, a, d, f), r && (r.faceIndex = Math.floor(i / 3), r.face.materialIndex = s.materialIndex, t.push(r));
				}
			}
			else {
				let i = Math.max(0, f.start), s = Math.min(o.count, f.start + f.count);
				for (let d = i, f = s; d < f; d += 3) {
					let i = o.getX(d), s = o.getX(d + 1), f = o.getX(d + 2);
					r = ri(this, a, e, n, c, l, u, i, s, f), r && (r.faceIndex = Math.floor(d / 3), t.push(r));
				}
			}
		} else if (s !== void 0) {
			if (Array.isArray(a)) for (let i = 0, o = d.length; i < o; i++) {
				let o = d[i], p = a[o.materialIndex], m = Math.max(o.start, f.start), h = Math.min(s.count, Math.min(o.start + o.count, f.start + f.count));
				for (let i = m, a = h; i < a; i += 3) {
					let a = i, s = i + 1, d = i + 2;
					r = ri(this, p, e, n, c, l, u, a, s, d), r && (r.faceIndex = Math.floor(i / 3), r.face.materialIndex = o.materialIndex, t.push(r));
				}
			}
			else {
				let i = Math.max(0, f.start), o = Math.min(s.count, f.start + f.count);
				for (let s = i, d = o; s < d; s += 3) {
					let i = s, o = s + 1, d = s + 2;
					r = ri(this, a, e, n, c, l, u, i, o, d), r && (r.faceIndex = Math.floor(s / 3), t.push(r));
				}
			}
		}
	}
};
function ni(e, t, n, r, i, a, o, s) {
	let c;
	if (c = t.side === 1 ? r.intersectTriangle(o, a, i, !0, s) : r.intersectTriangle(i, a, o, t.side === 0, s), c === null) return null;
	ei.copy(s), ei.applyMatrix4(e.matrixWorld);
	let l = n.ray.origin.distanceTo(ei);
	return l < n.near || l > n.far ? null : {
		distance: l,
		point: ei.clone(),
		object: e
	};
}
function ri(e, t, n, r, i, a, o, s, c, l) {
	e.getVertexPosition(s, Jr), e.getVertexPosition(c, Yr), e.getVertexPosition(l, Xr);
	let u = ni(e, t, n, r, Jr, Yr, Xr, $r);
	if (u) {
		let e = new W();
		Jn.getBarycoord($r, Jr, Yr, Xr, e), i && (u.uv = Jn.getInterpolatedAttribute(i, s, c, l, e, new U())), a && (u.uv1 = Jn.getInterpolatedAttribute(a, s, c, l, e, new U())), o && (u.normal = Jn.getInterpolatedAttribute(o, s, c, l, e, new W()), u.normal.dot(r.direction) > 0 && u.normal.multiplyScalar(-1));
		let t = {
			a: s,
			b: c,
			c: l,
			normal: new W(),
			materialIndex: 0
		};
		Jn.getNormal(Jr, Yr, Xr, t.normal), u.face = t, u.barycoord = e;
	}
	return u;
}
var ii = /*@__PURE__*/ new qt(), ai = /*@__PURE__*/ new qt(), oi = /*@__PURE__*/ new qt(), si = /*@__PURE__*/ new qt(), ci = /*@__PURE__*/ new q(), li = /*@__PURE__*/ new W(), ui = /*@__PURE__*/ new br(), di = /*@__PURE__*/ new q(), fi = /*@__PURE__*/ new Hr(), pi = class extends ti {
	constructor(e, t) {
		super(e, t), this.isSkinnedMesh = !0, this.type = "SkinnedMesh", this.bindMode = n, this.bindMatrix = new q(), this.bindMatrixInverse = new q(), this.boundingBox = null, this.boundingSphere = null;
	}
	computeBoundingBox() {
		let e = this.geometry;
		this.boundingBox === null && (this.boundingBox = new Yn()), this.boundingBox.makeEmpty();
		let t = e.getAttribute("position");
		for (let e = 0; e < t.count; e++) this.getVertexPosition(e, li), this.boundingBox.expandByPoint(li);
	}
	computeBoundingSphere() {
		let e = this.geometry;
		this.boundingSphere === null && (this.boundingSphere = new br()), this.boundingSphere.makeEmpty();
		let t = e.getAttribute("position");
		for (let e = 0; e < t.count; e++) this.getVertexPosition(e, li), this.boundingSphere.expandByPoint(li);
	}
	copy(e, t) {
		return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
	}
	raycast(e, t) {
		let n = this.material, r = this.matrixWorld;
		n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), ui.copy(this.boundingSphere), ui.applyMatrix4(r), e.ray.intersectsSphere(ui) !== !1 && (di.copy(r).invert(), fi.copy(e.ray).applyMatrix4(di), (this.boundingBox === null || fi.intersectsBox(this.boundingBox) !== !1) && this._computeIntersections(e, t, fi)));
	}
	getVertexPosition(e, t) {
		return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
	}
	bind(e, t) {
		this.skeleton = e, t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
	}
	pose() {
		this.skeleton.pose();
	}
	normalizeSkinWeights() {
		let e = new qt(), t = this.geometry.attributes.skinWeight;
		for (let n = 0, r = t.count; n < r; n++) {
			e.fromBufferAttribute(t, n);
			let r = 1 / e.manhattanLength();
			r === Infinity ? e.set(1, 0, 0, 0) : e.multiplyScalar(r), t.setXYZW(n, e.x, e.y, e.z, e.w);
		}
	}
	updateMatrixWorld(e) {
		super.updateMatrixWorld(e), this.bindMode === "attached" ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === "detached" ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : B("SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
	}
	applyBoneTransform(e, t) {
		let n = this.skeleton, r = this.geometry;
		ai.fromBufferAttribute(r.attributes.skinIndex, e), oi.fromBufferAttribute(r.attributes.skinWeight, e), t.isVector4 ? (ii.copy(t), t.set(0, 0, 0, 0)) : (ii.set(...t, 1), t.set(0, 0, 0)), ii.applyMatrix4(this.bindMatrix);
		for (let e = 0; e < 4; e++) {
			let r = oi.getComponent(e);
			if (r !== 0) {
				let i = ai.getComponent(e);
				ci.multiplyMatrices(n.bones[i].matrixWorld, n.boneInverses[i]), t.addScaledVector(si.copy(ii).applyMatrix4(ci), r);
			}
		}
		return t.isVector4 && (t.w = ii.w), t.applyMatrix4(this.bindMatrixInverse);
	}
}, mi = class extends Tn {
	constructor() {
		super(), this.isBone = !0, this.type = "Bone";
	}
}, hi = class extends Kt {
	constructor(e = null, t = 1, n = 1, r, i, a, s, c, l = o, u = o, d, f) {
		super(null, a, s, c, l, u, r, i, d, f), this.isDataTexture = !0, this.image = {
			data: e,
			width: t,
			height: n
		}, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
	}
}, gi = /*@__PURE__*/ new q(), _i = /*@__PURE__*/ new q(), vi = class e {
	constructor(e = [], t = []) {
		this.uuid = ct(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.boneTexture = null, this.init();
	}
	init() {
		let e = this.bones, t = this.boneInverses;
		if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0) this.calculateInverses();
		else if (e.length !== t.length) {
			B("Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
			for (let e = 0, t = this.bones.length; e < t; e++) this.boneInverses.push(new q());
		}
	}
	calculateInverses() {
		this.boneInverses.length = 0;
		for (let e = 0, t = this.bones.length; e < t; e++) {
			let t = new q();
			this.bones[e] && t.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(t);
		}
	}
	pose() {
		for (let e = 0, t = this.bones.length; e < t; e++) {
			let t = this.bones[e];
			t && t.matrixWorld.copy(this.boneInverses[e]).invert();
		}
		for (let e = 0, t = this.bones.length; e < t; e++) {
			let t = this.bones[e];
			t && (t.parent && t.parent.isBone ? (t.matrix.copy(t.parent.matrixWorld).invert(), t.matrix.multiply(t.matrixWorld)) : t.matrix.copy(t.matrixWorld), t.matrix.decompose(t.position, t.quaternion, t.scale));
		}
	}
	update() {
		let e = this.bones, t = this.boneInverses, n = this.boneMatrices, r = this.boneTexture;
		for (let r = 0, i = e.length; r < i; r++) {
			let i = e[r] ? e[r].matrixWorld : _i;
			gi.multiplyMatrices(i, t[r]), gi.toArray(n, r * 16);
		}
		r !== null && (r.needsUpdate = !0);
	}
	clone() {
		return new e(this.bones, this.boneInverses);
	}
	computeBoneTexture() {
		let e = Math.sqrt(this.bones.length * 4);
		e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
		let t = new Float32Array(e * e * 4);
		t.set(this.boneMatrices);
		let n = new hi(t, e, e, D, v);
		return n.needsUpdate = !0, this.boneMatrices = t, this.boneTexture = n, this;
	}
	getBoneByName(e) {
		for (let t = 0, n = this.bones.length; t < n; t++) {
			let n = this.bones[t];
			if (n.name === e) return n;
		}
	}
	dispose() {
		this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
	}
	fromJSON(e, t) {
		this.uuid = e.uuid;
		for (let n = 0, r = e.bones.length; n < r; n++) {
			let r = e.bones[n], i = t[r];
			i === void 0 && (B("Skeleton: No bone found with UUID:", r), i = new mi()), this.bones.push(i), this.boneInverses.push(new q().fromArray(e.boneInverses[n]));
		}
		return this.init(), this;
	}
	toJSON() {
		let e = {
			metadata: {
				version: 4.7,
				type: "Skeleton",
				generator: "Skeleton.toJSON"
			},
			bones: [],
			boneInverses: []
		};
		e.uuid = this.uuid;
		let t = this.bones, n = this.boneInverses;
		for (let r = 0, i = t.length; r < i; r++) {
			let i = t[r];
			e.bones.push(i.uuid);
			let a = n[r];
			e.boneInverses.push(a.toArray());
		}
		return e;
	}
}, yi = class extends pr {
	constructor(e, t, n, r = 1) {
		super(e, t, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = r;
	}
	copy(e) {
		return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
	}
}, bi = /*@__PURE__*/ new q(), xi = /*@__PURE__*/ new q(), Si = [], Ci = /*@__PURE__*/ new Yn(), wi = /*@__PURE__*/ new q(), Ti = /*@__PURE__*/ new ti(), Ei = /*@__PURE__*/ new br(), Di = class extends ti {
	constructor(e, t, n) {
		super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new yi(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
		for (let e = 0; e < n; e++) this.setMatrixAt(e, wi);
	}
	computeBoundingBox() {
		let e = this.geometry, t = this.count;
		this.boundingBox === null && (this.boundingBox = new Yn()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
		for (let n = 0; n < t; n++) this.getMatrixAt(n, bi), Ci.copy(e.boundingBox).applyMatrix4(bi), this.boundingBox.union(Ci);
	}
	computeBoundingSphere() {
		let e = this.geometry, t = this.count;
		this.boundingSphere === null && (this.boundingSphere = new br()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
		for (let n = 0; n < t; n++) this.getMatrixAt(n, bi), Ei.copy(e.boundingSphere).applyMatrix4(bi), this.boundingSphere.union(Ei);
	}
	copy(e, t) {
		return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
	}
	getColorAt(e, t) {
		return this.instanceColor === null ? t.setRGB(1, 1, 1) : t.fromArray(this.instanceColor.array, e * 3);
	}
	getMatrixAt(e, t) {
		return t.fromArray(this.instanceMatrix.array, e * 16);
	}
	getMorphAt(e, t) {
		let n = t.morphTargetInfluences, r = this.morphTexture.source.data.data, i = e * (n.length + 1) + 1;
		for (let e = 0; e < n.length; e++) n[e] = r[i + e];
	}
	raycast(e, t) {
		let n = this.matrixWorld, r = this.count;
		if (Ti.geometry = this.geometry, Ti.material = this.material, Ti.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Ei.copy(this.boundingSphere), Ei.applyMatrix4(n), e.ray.intersectsSphere(Ei) !== !1)) for (let i = 0; i < r; i++) {
			this.getMatrixAt(i, bi), xi.multiplyMatrices(n, bi), Ti.matrixWorld = xi, Ti.raycast(e, Si);
			for (let e = 0, n = Si.length; e < n; e++) {
				let n = Si[e];
				n.instanceId = i, n.object = this, t.push(n);
			}
			Si.length = 0;
		}
	}
	setColorAt(e, t) {
		return this.instanceColor === null && (this.instanceColor = new yi(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3), this;
	}
	setMatrixAt(e, t) {
		return t.toArray(this.instanceMatrix.array, e * 16), this;
	}
	setMorphAt(e, t) {
		let n = t.morphTargetInfluences, r = n.length + 1;
		this.morphTexture === null && (this.morphTexture = new hi(new Float32Array(r * this.count), r, this.count, A, v));
		let i = this.morphTexture.source.data.data, a = 0;
		for (let e = 0; e < n.length; e++) a += n[e];
		let o = this.geometry.morphTargetsRelative ? 1 : 1 - a, s = r * e;
		return i[s] = o, i.set(n, s + 1), this;
	}
	updateMorphTargets() {}
	dispose() {
		super.dispose(), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
	}
}, Oi = /*@__PURE__*/ new br(), ki = /*@__PURE__*/ new U(.5, .5), Ai = /*@__PURE__*/ new W(), ji = class {
	constructor(e = new Fr(), t = new Fr(), n = new Fr(), r = new Fr(), i = new Fr(), a = new Fr()) {
		this.planes = [
			e,
			t,
			n,
			r,
			i,
			a
		];
	}
	set(e, t, n, r, i, a) {
		let o = this.planes;
		return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(r), o[4].copy(i), o[5].copy(a), this;
	}
	copy(e) {
		let t = this.planes;
		for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
		return this;
	}
	setFromProjectionMatrix(e, t = Ke, n = !1) {
		let r = this.planes, i = e.elements, a = i[0], o = i[1], s = i[2], c = i[3], l = i[4], u = i[5], d = i[6], f = i[7], p = i[8], m = i[9], h = i[10], g = i[11], _ = i[12], v = i[13], y = i[14], b = i[15];
		if (r[0].setComponents(c - a, f - l, g - p, b - _).normalize(), r[1].setComponents(c + a, f + l, g + p, b + _).normalize(), r[2].setComponents(c + o, f + u, g + m, b + v).normalize(), r[3].setComponents(c - o, f - u, g - m, b - v).normalize(), n) r[4].setComponents(s, d, h, y).normalize(), r[5].setComponents(c - s, f - d, g - h, b - y).normalize();
		else if (r[4].setComponents(c - s, f - d, g - h, b - y).normalize(), t === 2e3) r[5].setComponents(c + s, f + d, g + h, b + y).normalize();
		else if (t === 2001) r[5].setComponents(s, d, h, y).normalize();
		else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
		return this;
	}
	intersectsObject(e) {
		if (e.boundingSphere !== void 0) e.boundingSphere === null && e.computeBoundingSphere(), Oi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
		else {
			let t = e.geometry;
			t.boundingSphere === null && t.computeBoundingSphere(), Oi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
		}
		return this.intersectsSphere(Oi);
	}
	intersectsSprite(e) {
		return Oi.center.set(0, 0, 0), Oi.radius = .7071067811865476 + ki.distanceTo(e.center), Oi.applyMatrix4(e.matrixWorld), this.intersectsSphere(Oi);
	}
	intersectsSphere(e) {
		let t = this.planes, n = e.center, r = -e.radius;
		for (let e = 0; e < 6; e++) if (t[e].distanceToPoint(n) < r) return !1;
		return !0;
	}
	intersectsBox(e) {
		let t = this.planes;
		for (let n = 0; n < 6; n++) {
			let r = t[n];
			if (Ai.x = r.normal.x > 0 ? e.max.x : e.min.x, Ai.y = r.normal.y > 0 ? e.max.y : e.min.y, Ai.z = r.normal.z > 0 ? e.max.z : e.min.z, r.distanceToPoint(Ai) < 0) return !1;
		}
		return !0;
	}
	containsPoint(e) {
		let t = this.planes;
		for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return !1;
		return !0;
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, Mi = /*@__PURE__*/ new q(), Ni = class e {
	constructor() {
		this.coordinateSystem = Ke, this._frustums = [], this._count = 0;
	}
	setFromArrayCamera(e) {
		let t = e.cameras, n = this._frustums;
		for (let e = 0; e < t.length; e++) {
			let r = t[e];
			Mi.multiplyMatrices(r.projectionMatrix, r.matrixWorldInverse), n[e] === void 0 && (n[e] = new ji()), n[e].setFromProjectionMatrix(Mi, r.coordinateSystem, r.reversedDepth);
		}
		return this._count = t.length, this;
	}
	intersectsObject(e) {
		let t = this._frustums;
		for (let n = 0; n < this._count; n++) if (t[n].intersectsObject(e)) return !0;
		return !1;
	}
	intersectsSprite(e) {
		let t = this._frustums;
		for (let n = 0; n < this._count; n++) if (t[n].intersectsSprite(e)) return !0;
		return !1;
	}
	intersectsSphere(e) {
		let t = this._frustums;
		for (let n = 0; n < this._count; n++) if (t[n].intersectsSphere(e)) return !0;
		return !1;
	}
	intersectsBox(e) {
		let t = this._frustums;
		for (let n = 0; n < this._count; n++) if (t[n].intersectsBox(e)) return !0;
		return !1;
	}
	containsPoint(e) {
		let t = this._frustums;
		for (let n = 0; n < this._count; n++) if (t[n].containsPoint(e)) return !0;
		return !1;
	}
	copy(e) {
		this.coordinateSystem = e.coordinateSystem;
		let t = this._frustums, n = e._frustums;
		for (let r = 0; r < e._count; r++) t[r] === void 0 && (t[r] = new ji()), t[r].copy(n[r]);
		return this._count = e._count, this;
	}
	clone() {
		return new e().copy(this);
	}
};
function Pi(e, t) {
	return e - t;
}
function Fi(e, t) {
	return e.z - t.z;
}
function Ii(e, t) {
	return t.z - e.z;
}
var Li = class {
	constructor() {
		this.index = 0, this.pool = [], this.list = [];
	}
	push(e, t, n, r) {
		let i = this.pool, a = this.list;
		this.index >= i.length && i.push({
			start: -1,
			count: -1,
			z: -1,
			index: -1
		});
		let o = i[this.index];
		a.push(o), this.index++, o.start = e, o.count = t, o.z = n, o.index = r;
	}
	reset() {
		this.list.length = 0, this.index = 0;
	}
}, Ri = /*@__PURE__*/ new q(), zi = /*@__PURE__*/ new J(1, 1, 1), Bi = /*@__PURE__*/ new ji(), Vi = /*@__PURE__*/ new Ni(), Hi = /*@__PURE__*/ new Yn(), Ui = /*@__PURE__*/ new br(), Wi = /*@__PURE__*/ new W(), Gi = /*@__PURE__*/ new W(), Ki = /*@__PURE__*/ new W(), qi = /*@__PURE__*/ new Li(), Ji = /*@__PURE__*/ new ti(), Yi = [];
function Xi(e, t, n = 0) {
	let r = t.itemSize;
	if (e.isInterleavedBufferAttribute || e.array.constructor !== t.array.constructor) {
		let i = e.count;
		for (let a = 0; a < i; a++) for (let i = 0; i < r; i++) t.setComponent(a + n, i, e.getComponent(a, i));
	} else t.array.set(e.array, n * r);
	t.needsUpdate = !0;
}
function Zi(e, t) {
	if (e.constructor !== t.constructor) {
		let n = Math.min(e.length, t.length);
		for (let r = 0; r < n; r++) t[r] = e[r];
	} else {
		let n = Math.min(e.length, t.length);
		t.set(new e.constructor(e.buffer, 0, n));
	}
}
var Qi = class extends ti {
	constructor(e, t, n = t * 2, r) {
		super(new Or(), r), this.isBatchedMesh = !0, this.perObjectFrustumCulled = !0, this.sortObjects = !0, this.boundingBox = null, this.boundingSphere = null, this.customSort = null, this._instanceInfo = [], this._geometryInfo = [], this._availableInstanceIds = [], this._availableGeometryIds = [], this._nextIndexStart = 0, this._nextVertexStart = 0, this._geometryCount = 0, this._visibilityChanged = !0, this._geometryInitialized = !1, this._maxInstanceCount = e, this._maxVertexCount = t, this._maxIndexCount = n, this._multiDrawCounts = new Int32Array(e), this._multiDrawStarts = new Int32Array(e), this._multiDrawCount = 0, this._multiDrawBytesPerElement = 1, this._matricesTexture = null, this._indirectTexture = null, this._colorsTexture = null, this._initMatricesTexture(), this._initIndirectTexture();
	}
	get maxInstanceCount() {
		return this._maxInstanceCount;
	}
	get instanceCount() {
		return this._instanceInfo.length - this._availableInstanceIds.length;
	}
	get unusedVertexCount() {
		return this._maxVertexCount - this._nextVertexStart;
	}
	get unusedIndexCount() {
		return this._maxIndexCount - this._nextIndexStart;
	}
	_initMatricesTexture() {
		let e = Math.sqrt(this._maxInstanceCount * 4);
		e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
		let t = new hi(new Float32Array(e * e * 4), e, e, D, v);
		this._matricesTexture = t;
	}
	_initIndirectTexture() {
		let e = Math.sqrt(this._maxInstanceCount);
		e = Math.ceil(e);
		let t = new hi(new Uint32Array(e * e), e, e, j, _);
		this._indirectTexture = t;
	}
	_initColorsTexture() {
		let e = Math.sqrt(this._maxInstanceCount);
		e = Math.ceil(e);
		let t = new hi(new Float32Array(e * e * 4).fill(1), e, e, D, v);
		t.colorSpace = K.workingColorSpace, this._colorsTexture = t;
	}
	_initializeGeometry(e) {
		let t = this.geometry, n = this._maxVertexCount, r = this._maxIndexCount;
		if (this._geometryInitialized === !1) {
			for (let r in e.attributes) {
				let { array: i, itemSize: a, normalized: o } = e.getAttribute(r), s = new pr(new i.constructor(n * a), a, o);
				t.setAttribute(r, s);
			}
			if (e.getIndex() !== null) {
				let e = n > 65535 ? new Uint32Array(r) : new Uint16Array(r);
				t.setIndex(new pr(e, 1));
			}
			this._geometryInitialized = !0;
		}
	}
	_validateGeometry(e) {
		let t = this.geometry;
		if (!!e.getIndex() != !!t.getIndex()) throw Error("THREE.BatchedMesh: All geometries must consistently have \"index\".");
		for (let n in t.attributes) {
			if (!e.hasAttribute(n)) throw Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);
			let r = e.getAttribute(n), i = t.getAttribute(n);
			if (r.itemSize !== i.itemSize || r.normalized !== i.normalized) throw Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.");
		}
	}
	validateInstanceId(e) {
		let t = this._instanceInfo;
		if (e < 0 || e >= t.length || t[e].active === !1) throw Error(`THREE.BatchedMesh: Invalid instanceId ${e}. Instance is either out of range or has been deleted.`);
	}
	validateGeometryId(e) {
		let t = this._geometryInfo;
		if (e < 0 || e >= t.length || t[e].active === !1) throw Error(`THREE.BatchedMesh: Invalid geometryId ${e}. Geometry is either out of range or has been deleted.`);
	}
	setCustomSort(e) {
		return this.customSort = e, this;
	}
	computeBoundingBox() {
		this.boundingBox === null && (this.boundingBox = new Yn());
		let e = this.boundingBox, t = this._instanceInfo;
		e.makeEmpty();
		for (let n = 0, r = t.length; n < r; n++) {
			if (t[n].active === !1) continue;
			let r = t[n].geometryIndex;
			this.getMatrixAt(n, Ri), this.getBoundingBoxAt(r, Hi).applyMatrix4(Ri), e.union(Hi);
		}
	}
	computeBoundingSphere() {
		this.boundingSphere === null && (this.boundingSphere = new br());
		let e = this.boundingSphere, t = this._instanceInfo;
		e.makeEmpty();
		for (let n = 0, r = t.length; n < r; n++) {
			if (t[n].active === !1) continue;
			let r = t[n].geometryIndex;
			this.getMatrixAt(n, Ri), this.getBoundingSphereAt(r, Ui).applyMatrix4(Ri), e.union(Ui);
		}
	}
	addInstance(e) {
		if (this._instanceInfo.length >= this.maxInstanceCount && this._availableInstanceIds.length === 0) throw Error("THREE.BatchedMesh: Maximum item count reached.");
		let t = {
			visible: !0,
			active: !0,
			geometryIndex: e
		}, n = null;
		this._availableInstanceIds.length > 0 ? (this._availableInstanceIds.sort(Pi), n = this._availableInstanceIds.shift(), this._instanceInfo[n] = t) : (n = this._instanceInfo.length, this._instanceInfo.push(t));
		let r = this._matricesTexture;
		Ri.identity().toArray(r.image.data, n * 16), r.needsUpdate = !0;
		let i = this._colorsTexture;
		return i && (zi.toArray(i.image.data, n * 4), i.needsUpdate = !0), this._visibilityChanged = !0, n;
	}
	addGeometry(e, t = -1, n = -1) {
		this._initializeGeometry(e), this._validateGeometry(e);
		let r = {
			vertexStart: -1,
			vertexCount: -1,
			reservedVertexCount: -1,
			indexStart: -1,
			indexCount: -1,
			reservedIndexCount: -1,
			start: -1,
			count: -1,
			boundingBox: null,
			boundingSphere: null,
			active: !0
		}, i = this._geometryInfo;
		r.vertexStart = this._nextVertexStart, r.reservedVertexCount = t === -1 ? e.getAttribute("position").count : t;
		let a = e.getIndex();
		if (a !== null && (r.indexStart = this._nextIndexStart, r.reservedIndexCount = n === -1 ? a.count : n), r.indexStart !== -1 && r.indexStart + r.reservedIndexCount > this._maxIndexCount || r.vertexStart + r.reservedVertexCount > this._maxVertexCount) throw Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");
		let o;
		return this._availableGeometryIds.length > 0 ? (this._availableGeometryIds.sort(Pi), o = this._availableGeometryIds.shift(), i[o] = r) : (o = this._geometryCount, this._geometryCount++, i.push(r)), this.setGeometryAt(o, e), this._nextIndexStart = r.indexStart + r.reservedIndexCount, this._nextVertexStart = r.vertexStart + r.reservedVertexCount, o;
	}
	setGeometryAt(e, t) {
		if (e >= this._geometryCount) throw Error("THREE.BatchedMesh: Maximum geometry count reached.");
		this._validateGeometry(t);
		let n = this.geometry, r = n.getIndex() !== null, i = n.getIndex(), a = t.getIndex(), o = this._geometryInfo[e];
		if (r && a.count > o.reservedIndexCount || t.attributes.position.count > o.reservedVertexCount) throw Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");
		let s = o.vertexStart, c = o.reservedVertexCount;
		o.vertexCount = t.getAttribute("position").count;
		for (let e in n.attributes) {
			let r = t.getAttribute(e), i = n.getAttribute(e);
			Xi(r, i, s);
			let a = r.itemSize;
			for (let e = r.count, t = c; e < t; e++) {
				let t = s + e;
				for (let e = 0; e < a; e++) i.setComponent(t, e, 0);
			}
			i.needsUpdate = !0, i.addUpdateRange(s * a, c * a);
		}
		if (r) {
			let e = o.indexStart, n = o.reservedIndexCount;
			o.indexCount = t.getIndex().count;
			for (let t = 0; t < a.count; t++) i.setX(e + t, s + a.getX(t));
			for (let t = a.count, r = n; t < r; t++) i.setX(e + t, s);
			i.needsUpdate = !0, i.addUpdateRange(e, o.reservedIndexCount);
		}
		return o.start = r ? o.indexStart : o.vertexStart, o.count = r ? o.indexCount : o.vertexCount, o.boundingBox = null, t.boundingBox !== null && (o.boundingBox = t.boundingBox.clone()), o.boundingSphere = null, t.boundingSphere !== null && (o.boundingSphere = t.boundingSphere.clone()), this._visibilityChanged = !0, e;
	}
	deleteGeometry(e) {
		let t = this._geometryInfo;
		if (e >= t.length || t[e].active === !1) return this;
		let n = this._instanceInfo;
		for (let t = 0, r = n.length; t < r; t++) n[t].active && n[t].geometryIndex === e && this.deleteInstance(t);
		return t[e].active = !1, this._availableGeometryIds.push(e), this._visibilityChanged = !0, this;
	}
	deleteInstance(e) {
		return this.validateInstanceId(e), this._instanceInfo[e].active = !1, this._availableInstanceIds.push(e), this._visibilityChanged = !0, this;
	}
	optimize() {
		let e = 0, t = 0, n = this._geometryInfo, r = n.map((e, t) => t).sort((e, t) => n[e].vertexStart - n[t].vertexStart), i = this.geometry;
		for (let a = 0, o = n.length; a < o; a++) {
			let o = n[r[a]];
			if (o.active !== !1) {
				if (i.index !== null) {
					if (o.indexStart !== t) {
						let { indexStart: n, vertexStart: r, reservedIndexCount: a } = o, s = i.index, c = s.array, l = e - r;
						for (let e = n; e < n + a; e++) c[e] = c[e] + l;
						s.array.copyWithin(t, n, n + a), s.addUpdateRange(t, a), s.needsUpdate = !0, o.indexStart = t;
					}
					t += o.reservedIndexCount;
				}
				if (o.vertexStart !== e) {
					let { vertexStart: t, reservedVertexCount: n } = o, r = i.attributes;
					for (let i in r) {
						let a = r[i], { array: o, itemSize: s } = a;
						o.copyWithin(e * s, t * s, (t + n) * s), a.addUpdateRange(e * s, n * s), a.needsUpdate = !0;
					}
					o.vertexStart = e;
				}
				e += o.reservedVertexCount, o.start = i.index ? o.indexStart : o.vertexStart;
			}
		}
		return this._nextIndexStart = t, this._nextVertexStart = e, this._visibilityChanged = !0, this;
	}
	getBoundingBoxAt(e, t) {
		if (e >= this._geometryCount) return null;
		let n = this.geometry, r = this._geometryInfo[e];
		if (r.boundingBox === null) {
			let e = new Yn(), t = n.index, i = n.attributes.position;
			for (let n = r.start, a = r.start + r.count; n < a; n++) {
				let r = n;
				t && (r = t.getX(r)), e.expandByPoint(Wi.fromBufferAttribute(i, r));
			}
			r.boundingBox = e;
		}
		return t.copy(r.boundingBox), t;
	}
	getBoundingSphereAt(e, t) {
		if (e >= this._geometryCount) return null;
		let n = this.geometry, r = this._geometryInfo[e];
		if (r.boundingSphere === null) {
			let t = new br();
			this.getBoundingBoxAt(e, Hi), Hi.getCenter(t.center);
			let i = n.index, a = n.attributes.position, o = 0;
			for (let e = r.start, n = r.start + r.count; e < n; e++) {
				let n = e;
				i && (n = i.getX(n)), Wi.fromBufferAttribute(a, n), o = Math.max(o, t.center.distanceToSquared(Wi));
			}
			t.radius = Math.sqrt(o), r.boundingSphere = t;
		}
		return t.copy(r.boundingSphere), t;
	}
	setMatrixAt(e, t) {
		this.validateInstanceId(e);
		let n = this._matricesTexture, r = this._matricesTexture.image.data;
		return t.toArray(r, e * 16), n.needsUpdate = !0, this;
	}
	getMatrixAt(e, t) {
		return this.validateInstanceId(e), t.fromArray(this._matricesTexture.image.data, e * 16);
	}
	setColorAt(e, t) {
		return this.validateInstanceId(e), this._colorsTexture === null && this._initColorsTexture(), t.toArray(this._colorsTexture.image.data, e * 4), this._colorsTexture.needsUpdate = !0, this;
	}
	getColorAt(e, t) {
		return this.validateInstanceId(e), this._colorsTexture === null ? t.isVector4 ? t.set(1, 1, 1, 1) : t.setRGB(1, 1, 1) : t.fromArray(this._colorsTexture.image.data, e * 4);
	}
	setVisibleAt(e, t) {
		return this.validateInstanceId(e), this._instanceInfo[e].visible === t || (this._instanceInfo[e].visible = t, this._visibilityChanged = !0), this;
	}
	getVisibleAt(e) {
		return this.validateInstanceId(e), this._instanceInfo[e].visible;
	}
	setGeometryIdAt(e, t) {
		return this.validateInstanceId(e), this.validateGeometryId(t), this._instanceInfo[e].geometryIndex = t, this._visibilityChanged = !0, this;
	}
	getGeometryIdAt(e) {
		return this.validateInstanceId(e), this._instanceInfo[e].geometryIndex;
	}
	getGeometryRangeAt(e, t = {}) {
		this.validateGeometryId(e);
		let n = this._geometryInfo[e];
		return t.vertexStart = n.vertexStart, t.vertexCount = n.vertexCount, t.reservedVertexCount = n.reservedVertexCount, t.indexStart = n.indexStart, t.indexCount = n.indexCount, t.reservedIndexCount = n.reservedIndexCount, t.start = n.start, t.count = n.count, t;
	}
	setInstanceCount(e) {
		let t = this._availableInstanceIds, n = this._instanceInfo;
		for (t.sort(Pi); t[t.length - 1] === n.length - 1;) n.pop(), t.pop();
		if (e < n.length) throw Error(`THREE.BatchedMesh: Instance ids outside the range ${e} are being used. Cannot shrink instance count.`);
		let r = new Int32Array(e), i = new Int32Array(e);
		Zi(this._multiDrawCounts, r), Zi(this._multiDrawStarts, i), this._multiDrawCounts = r, this._multiDrawStarts = i, this._maxInstanceCount = e;
		let a = this._indirectTexture, o = this._matricesTexture, s = this._colorsTexture;
		a.dispose(), this._initIndirectTexture(), Zi(a.image.data, this._indirectTexture.image.data), o.dispose(), this._initMatricesTexture(), Zi(o.image.data, this._matricesTexture.image.data), s && (s.dispose(), this._initColorsTexture(), Zi(s.image.data, this._colorsTexture.image.data));
	}
	setGeometrySize(e, t) {
		let n = [...this._geometryInfo].filter((e) => e.active);
		if (Math.max(...n.map((e) => e.vertexStart + e.reservedVertexCount)) > e) throw Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${t}. Cannot shrink further.`);
		if (this.geometry.index && Math.max(...n.map((e) => e.indexStart + e.reservedIndexCount)) > t) throw Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${t}. Cannot shrink further.`);
		let r = this.geometry;
		r.dispose(), this._maxVertexCount = e, this._maxIndexCount = t, this._geometryInitialized && (this._geometryInitialized = !1, this.geometry = new Or(), this._initializeGeometry(r));
		let i = this.geometry;
		r.index && Zi(r.index.array, i.index.array);
		for (let e in r.attributes) Zi(r.attributes[e].array, i.attributes[e].array);
	}
	raycast(e, t) {
		let n = this._instanceInfo, r = this._geometryInfo, i = this.matrixWorld, a = this.geometry;
		Ji.material = this.material, Ji.geometry.index = a.index, Ji.geometry.attributes = a.attributes, Ji.geometry.boundingBox === null && (Ji.geometry.boundingBox = new Yn()), Ji.geometry.boundingSphere === null && (Ji.geometry.boundingSphere = new br());
		for (let a = 0, o = n.length; a < o; a++) {
			if (!n[a].visible || !n[a].active) continue;
			let o = n[a].geometryIndex, s = r[o];
			Ji.geometry.setDrawRange(s.start, s.count), this.getMatrixAt(a, Ji.matrixWorld).premultiply(i), this.getBoundingBoxAt(o, Ji.geometry.boundingBox), this.getBoundingSphereAt(o, Ji.geometry.boundingSphere), Ji.raycast(e, Yi);
			for (let e = 0, n = Yi.length; e < n; e++) {
				let n = Yi[e];
				n.object = this, n.batchId = a, t.push(n);
			}
			Yi.length = 0;
		}
		Ji.material = null, Ji.geometry.index = null, Ji.geometry.attributes = {}, Ji.geometry.setDrawRange(0, Infinity);
	}
	copy(e) {
		return super.copy(e), this.geometry = e.geometry.clone(), this.perObjectFrustumCulled = e.perObjectFrustumCulled, this.sortObjects = e.sortObjects, this.boundingBox = e.boundingBox === null ? null : e.boundingBox.clone(), this.boundingSphere = e.boundingSphere === null ? null : e.boundingSphere.clone(), this._geometryInfo = e._geometryInfo.map((e) => ({
			...e,
			boundingBox: e.boundingBox === null ? null : e.boundingBox.clone(),
			boundingSphere: e.boundingSphere === null ? null : e.boundingSphere.clone()
		})), this._instanceInfo = e._instanceInfo.map((e) => ({ ...e })), this._availableInstanceIds = e._availableInstanceIds.slice(), this._availableGeometryIds = e._availableGeometryIds.slice(), this._nextIndexStart = e._nextIndexStart, this._nextVertexStart = e._nextVertexStart, this._geometryCount = e._geometryCount, this._maxInstanceCount = e._maxInstanceCount, this._maxVertexCount = e._maxVertexCount, this._maxIndexCount = e._maxIndexCount, this._geometryInitialized = e._geometryInitialized, this._multiDrawCounts = e._multiDrawCounts.slice(), this._multiDrawStarts = e._multiDrawStarts.slice(), this._multiDrawBytesPerElement = e._multiDrawBytesPerElement, this._indirectTexture = e._indirectTexture.clone(), this._indirectTexture.image.data = this._indirectTexture.image.data.slice(), this._matricesTexture = e._matricesTexture.clone(), this._matricesTexture.image.data = this._matricesTexture.image.data.slice(), this._colorsTexture !== null && (this._colorsTexture = e._colorsTexture.clone(), this._colorsTexture.image.data = this._colorsTexture.image.data.slice()), this;
	}
	dispose() {
		super.dispose(), this.geometry.dispose(), this._matricesTexture.dispose(), this._matricesTexture = null, this._indirectTexture.dispose(), this._indirectTexture = null, this._colorsTexture !== null && (this._colorsTexture.dispose(), this._colorsTexture = null);
	}
	onBeforeRender(e, t, n, r, i) {
		if (!this._visibilityChanged && !this.perObjectFrustumCulled && !this.sortObjects) return;
		let a = r.getIndex(), o = a === null ? 1 : a.array.BYTES_PER_ELEMENT, s = 1;
		i.wireframe && (s = 2, o = r.attributes.position.count > 65535 ? 4 : 2);
		let c = this._instanceInfo, l = this._multiDrawStarts, u = this._multiDrawCounts, d = this._geometryInfo, f = this.perObjectFrustumCulled, p = this._indirectTexture, m = p.image.data, h = n.isArrayCamera ? Vi : Bi;
		f && (n.isArrayCamera ? h.setFromArrayCamera(n) : (Ri.multiplyMatrices(n.projectionMatrix, n.matrixWorldInverse).multiply(this.matrixWorld), h.setFromProjectionMatrix(Ri, n.coordinateSystem, n.reversedDepth)));
		let g = 0;
		if (this.sortObjects) {
			Ri.copy(this.matrixWorld).invert(), Wi.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Ri), Gi.set(0, 0, -1).transformDirection(n.matrixWorld).transformDirection(Ri);
			for (let e = 0, t = c.length; e < t; e++) if (c[e].visible && c[e].active) {
				let t = c[e].geometryIndex;
				this.getMatrixAt(e, Ri), this.getBoundingSphereAt(t, Ui).applyMatrix4(Ri);
				let n = !1;
				if (f && (n = !h.intersectsSphere(Ui)), !n) {
					let n = d[t], r = Ki.subVectors(Ui.center, Wi).dot(Gi);
					qi.push(n.start, n.count, r, e);
				}
			}
			let e = qi.list, t = this.customSort;
			t === null ? e.sort(i.transparent ? Ii : Fi) : t.call(this, e, n);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				l[g] = n.start * o * s, u[g] = n.count * s, m[g] = n.index, g++;
			}
			qi.reset();
		} else for (let e = 0, t = c.length; e < t; e++) if (c[e].visible && c[e].active) {
			let t = c[e].geometryIndex, n = !1;
			if (f && (this.getMatrixAt(e, Ri), this.getBoundingSphereAt(t, Ui).applyMatrix4(Ri), n = !h.intersectsSphere(Ui)), !n) {
				let n = d[t];
				l[g] = n.start * o * s, u[g] = n.count * s, m[g] = e, g++;
			}
		}
		p.needsUpdate = !0, this._multiDrawCount = g, this._multiDrawBytesPerElement = o, this._visibilityChanged = !1;
	}
	onBeforeShadow(e, t, n, r, i, a) {
		this.onBeforeRender(e, null, r, i, a);
	}
}, $i = class extends Lr {
	constructor(e) {
		super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new J(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
	}
}, ea = /*@__PURE__*/ new W(), ta = /*@__PURE__*/ new W(), na = /*@__PURE__*/ new q(), ra = /*@__PURE__*/ new Hr(), ia = /*@__PURE__*/ new br(), aa = /*@__PURE__*/ new W(), oa = /*@__PURE__*/ new W(), sa = class extends Tn {
	constructor(e = new Or(), t = new $i()) {
		super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
	}
	copy(e, t) {
		return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
	}
	computeLineDistances() {
		let e = this.geometry;
		if (e.index === null) {
			let t = e.attributes.position, n = [0];
			for (let e = 1, r = t.count; e < r; e++) ea.fromBufferAttribute(t, e - 1), ta.fromBufferAttribute(t, e), n[e] = n[e - 1], n[e] += ea.distanceTo(ta);
			e.setAttribute("lineDistance", new gr(n, 1));
		} else B("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
		return this;
	}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	raycast(e, t) {
		let n = this.geometry, r = this.matrixWorld, i = e.params.Line.threshold, a = n.drawRange;
		if (n.boundingSphere === null && n.computeBoundingSphere(), ia.copy(n.boundingSphere), ia.applyMatrix4(r), ia.radius += i, e.ray.intersectsSphere(ia) === !1) return;
		na.copy(r).invert(), ra.copy(e.ray).applyMatrix4(na);
		let o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3), s = o * o, c = this.isLineSegments ? 2 : 1, l = n.index, u = n.attributes.position;
		if (l !== null) {
			let n = Math.max(0, a.start), r = Math.min(l.count, a.start + a.count);
			for (let i = n, a = r - 1; i < a; i += c) {
				let n = l.getX(i), r = l.getX(i + 1), a = ca(this, e, ra, s, n, r, i);
				a && t.push(a);
			}
			if (this.isLineLoop) {
				let i = l.getX(r - 1), a = l.getX(n), o = ca(this, e, ra, s, i, a, r - 1);
				o && t.push(o);
			}
		} else {
			let n = Math.max(0, a.start), r = Math.min(u.count, a.start + a.count);
			for (let i = n, a = r - 1; i < a; i += c) {
				let n = ca(this, e, ra, s, i, i + 1, i);
				n && t.push(n);
			}
			if (this.isLineLoop) {
				let i = ca(this, e, ra, s, r - 1, n, r - 1);
				i && t.push(i);
			}
		}
	}
	updateMorphTargets() {
		let e = this.geometry.morphAttributes, t = Object.keys(e);
		if (t.length > 0) {
			let n = e[t[0]];
			if (n !== void 0) {
				this.morphTargetInfluences = [], this.morphTargetDictionary = {};
				for (let e = 0, t = n.length; e < t; e++) {
					let t = n[e].name || String(e);
					this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
				}
			}
		}
	}
};
function ca(e, t, n, r, i, a, o) {
	let s = e.geometry.attributes.position;
	if (ea.fromBufferAttribute(s, i), ta.fromBufferAttribute(s, a), n.distanceSqToSegment(ea, ta, aa, oa) > r) return;
	aa.applyMatrix4(e.matrixWorld);
	let c = t.ray.origin.distanceTo(aa);
	if (!(c < t.near || c > t.far)) return {
		distance: c,
		point: oa.clone().applyMatrix4(e.matrixWorld),
		index: o,
		face: null,
		faceIndex: null,
		barycoord: null,
		object: e
	};
}
var la = /*@__PURE__*/ new W(), ua = /*@__PURE__*/ new W(), da = class extends sa {
	constructor(e, t) {
		super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
	}
	computeLineDistances() {
		let e = this.geometry;
		if (e.index === null) {
			let t = e.attributes.position, n = [];
			for (let e = 0, r = t.count; e < r; e += 2) la.fromBufferAttribute(t, e), ua.fromBufferAttribute(t, e + 1), n[e] = e === 0 ? 0 : n[e - 1], n[e + 1] = n[e] + la.distanceTo(ua);
			e.setAttribute("lineDistance", new gr(n, 1));
		} else B("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
		return this;
	}
}, fa = class extends sa {
	constructor(e, t) {
		super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
	}
}, pa = class extends Lr {
	constructor(e) {
		super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new J(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
	}
}, ma = /*@__PURE__*/ new q(), ha = /*@__PURE__*/ new Hr(), ga = /*@__PURE__*/ new br(), _a = /*@__PURE__*/ new W(), va = class extends Tn {
	constructor(e = new Or(), t = new pa()) {
		super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
	}
	copy(e, t) {
		return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
	}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	raycast(e, t) {
		let n = this.geometry, r = this.matrixWorld, i = e.params.Points.threshold, a = n.drawRange;
		if (n.boundingSphere === null && n.computeBoundingSphere(), ga.copy(n.boundingSphere), ga.applyMatrix4(r), ga.radius += i, e.ray.intersectsSphere(ga) === !1) return;
		ma.copy(r).invert(), ha.copy(e.ray).applyMatrix4(ma);
		let o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3), s = o * o, c = n.index, l = n.attributes.position;
		if (c !== null) {
			let n = Math.max(0, a.start), i = Math.min(c.count, a.start + a.count);
			for (let a = n, o = i; a < o; a++) {
				let n = c.getX(a);
				_a.fromBufferAttribute(l, n), ya(_a, n, s, r, e, t, this);
			}
		} else {
			let n = Math.max(0, a.start), i = Math.min(l.count, a.start + a.count);
			for (let a = n, o = i; a < o; a++) _a.fromBufferAttribute(l, a), ya(_a, a, s, r, e, t, this);
		}
	}
	updateMorphTargets() {
		let e = this.geometry.morphAttributes, t = Object.keys(e);
		if (t.length > 0) {
			let n = e[t[0]];
			if (n !== void 0) {
				this.morphTargetInfluences = [], this.morphTargetDictionary = {};
				for (let e = 0, t = n.length; e < t; e++) {
					let t = n[e].name || String(e);
					this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
				}
			}
		}
	}
};
function ya(e, t, n, r, i, a, o) {
	let s = ha.distanceSqToPoint(e);
	if (s < n) {
		let n = new W();
		ha.closestPointToPoint(e, n), n.applyMatrix4(r);
		let c = i.ray.origin.distanceTo(n);
		if (c < i.near || c > i.far) return;
		a.push({
			distance: c,
			distanceToRay: Math.sqrt(s),
			point: n,
			index: t,
			face: null,
			faceIndex: null,
			barycoord: null,
			object: o
		});
	}
}
var ba = class extends Kt {
	constructor(e = [], t = 301, n, r, i, a, o, s, c, l) {
		super(e, t, n, r, i, a, o, s, c, l), this.isCubeTexture = !0, this.flipY = !1;
	}
	get images() {
		return this.image;
	}
	set images(e) {
		this.image = e;
	}
}, xa = class extends Kt {
	constructor(e, t, n = _, r, i, a, s = o, c = o, l, u = O, d = 1) {
		if (u !== 1026 && u !== 1027) throw Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
		super({
			width: e,
			height: t,
			depth: d
		}, r, i, a, s, c, u, n, l), this.isDepthTexture = !0, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
	}
	copy(e) {
		return super.copy(e), this.source = new Ht(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.compareFunction = this.compareFunction, t;
	}
}, Sa = class extends xa {
	constructor(e, t = _, n = 301, r, i, a = o, s = o, c, l = O) {
		let u = {
			width: e,
			height: e,
			depth: 1
		}, d = [
			u,
			u,
			u,
			u,
			u,
			u
		];
		super(e, e, t, n, r, i, a, s, c, l), this.image = d, this.isCubeDepthTexture = !0, this.isCubeTexture = !0;
	}
	get images() {
		return this.image;
	}
	set images(e) {
		this.image = e;
	}
}, Ca = class extends Kt {
	constructor(e = null) {
		super(), this.sourceTexture = e, this.isExternalTexture = !0;
	}
	copy(e) {
		return super.copy(e), this.sourceTexture = e.sourceTexture, this;
	}
}, wa = class e extends Or {
	constructor(e = 1, t = 1, n = 1, r = 1, i = 1, a = 1) {
		super(), this.type = "BoxGeometry", this.parameters = {
			width: e,
			height: t,
			depth: n,
			widthSegments: r,
			heightSegments: i,
			depthSegments: a
		};
		let o = this;
		r = Math.floor(r), i = Math.floor(i), a = Math.floor(a);
		let s = [], c = [], l = [], u = [], d = 0, f = 0;
		p("z", "y", "x", -1, -1, n, t, e, a, i, 0), p("z", "y", "x", 1, -1, n, t, -e, a, i, 1), p("x", "z", "y", 1, 1, e, n, t, r, a, 2), p("x", "z", "y", 1, -1, e, n, -t, r, a, 3), p("x", "y", "z", 1, -1, e, t, n, r, i, 4), p("x", "y", "z", -1, -1, e, t, -n, r, i, 5), this.setIndex(s), this.setAttribute("position", new gr(c, 3)), this.setAttribute("normal", new gr(l, 3)), this.setAttribute("uv", new gr(u, 2));
		function p(e, t, n, r, i, a, p, m, h, g, _) {
			let v = a / h, y = p / g, b = a / 2, x = p / 2, S = m / 2, C = h + 1, w = g + 1, T = 0, E = 0, D = new W();
			for (let a = 0; a < w; a++) {
				let o = a * y - x;
				for (let s = 0; s < C; s++) D[e] = (s * v - b) * r, D[t] = o * i, D[n] = S, c.push(D.x, D.y, D.z), D[e] = 0, D[t] = 0, D[n] = m > 0 ? 1 : -1, l.push(D.x, D.y, D.z), u.push(s / h), u.push(1 - a / g), T += 1;
			}
			for (let e = 0; e < g; e++) for (let t = 0; t < h; t++) {
				let n = d + t + C * e, r = d + t + C * (e + 1), i = d + (t + 1) + C * (e + 1), a = d + (t + 1) + C * e;
				s.push(n, r, a), s.push(r, i, a), E += 6;
			}
			o.addGroup(f, E, _), f += E, d += T;
		}
	}
	copy(e) {
		return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
	}
	static fromJSON(t) {
		return new e(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
	}
}, Ta = class {
	constructor() {
		this.type = "Curve", this.arcLengthDivisions = 200, this.needsUpdate = !1, this.cacheArcLengths = null;
	}
	getPoint() {
		B("Curve: .getPoint() not implemented.");
	}
	getPointAt(e, t) {
		let n = this.getUtoTmapping(e);
		return this.getPoint(n, t);
	}
	getPoints(e = 5) {
		let t = [];
		for (let n = 0; n <= e; n++) t.push(this.getPoint(n / e));
		return t;
	}
	getSpacedPoints(e = 5) {
		let t = [];
		for (let n = 0; n <= e; n++) t.push(this.getPointAt(n / e));
		return t;
	}
	getLength() {
		let e = this.getLengths();
		return e[e.length - 1];
	}
	getLengths(e = this.arcLengthDivisions) {
		if (this.cacheArcLengths && this.cacheArcLengths.length === e + 1 && !this.needsUpdate) return this.cacheArcLengths;
		this.needsUpdate = !1;
		let t = [], n, r = this.getPoint(0), i = 0;
		t.push(0);
		for (let a = 1; a <= e; a++) n = this.getPoint(a / e), i += n.distanceTo(r), t.push(i), r = n;
		return this.cacheArcLengths = t, t;
	}
	updateArcLengths() {
		this.needsUpdate = !0, this.getLengths();
	}
	getUtoTmapping(e, t = null) {
		let n = this.getLengths(), r = 0, i = n.length, a;
		a = t || e * n[i - 1];
		let o = 0, s = i - 1, c;
		for (; o <= s;) if (r = Math.floor(o + (s - o) / 2), c = n[r] - a, c < 0) o = r + 1;
		else if (c > 0) s = r - 1;
		else {
			s = r;
			break;
		}
		if (r = s, n[r] === a) return r / (i - 1);
		let l = n[r], u = n[r + 1] - l, d = (a - l) / u;
		return (r + d) / (i - 1);
	}
	getTangent(e, t) {
		let n = 1e-4, r = e - n, i = e + n;
		r < 0 && (r = 0), i > 1 && (i = 1);
		let a = this.getPoint(r), o = this.getPoint(i), s = t || (a.isVector2 ? new U() : new W());
		return s.copy(o).sub(a).normalize(), s;
	}
	getTangentAt(e, t) {
		let n = this.getUtoTmapping(e);
		return this.getTangent(n, t);
	}
	computeFrenetFrames(e, t = !1) {
		let n = new W(), r = [], i = [], a = [], o = new W(), s = new q();
		for (let t = 0; t <= e; t++) {
			let n = t / e;
			r[t] = this.getTangentAt(n, new W());
		}
		i[0] = new W(), a[0] = new W();
		let c = Number.MAX_VALUE, l = Math.abs(r[0].x), u = Math.abs(r[0].y), d = Math.abs(r[0].z);
		l <= c && (c = l, n.set(1, 0, 0)), u <= c && (c = u, n.set(0, 1, 0)), d <= c && n.set(0, 0, 1), o.crossVectors(r[0], n).normalize(), i[0].crossVectors(r[0], o), a[0].crossVectors(r[0], i[0]);
		for (let t = 1; t <= e; t++) {
			if (i[t] = i[t - 1].clone(), a[t] = a[t - 1].clone(), o.crossVectors(r[t - 1], r[t]), o.length() > 2 ** -52) {
				o.normalize();
				let e = Math.acos(H(r[t - 1].dot(r[t]), -1, 1));
				i[t].applyMatrix4(s.makeRotationAxis(o, e));
			}
			a[t].crossVectors(r[t], i[t]);
		}
		if (t === !0) {
			let t = Math.acos(H(i[0].dot(i[e]), -1, 1));
			t /= e, r[0].dot(o.crossVectors(i[0], i[e])) > 0 && (t = -t);
			for (let n = 1; n <= e; n++) i[n].applyMatrix4(s.makeRotationAxis(r[n], t * n)), a[n].crossVectors(r[n], i[n]);
		}
		return {
			tangents: r,
			normals: i,
			binormals: a
		};
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.arcLengthDivisions = e.arcLengthDivisions, this;
	}
	toJSON() {
		let e = { metadata: {
			version: 4.7,
			type: "Curve",
			generator: "Curve.toJSON"
		} };
		return e.arcLengthDivisions = this.arcLengthDivisions, e.type = this.type, e;
	}
	fromJSON(e) {
		return this.arcLengthDivisions = e.arcLengthDivisions, this;
	}
}, Ea = class extends Ta {
	constructor(e = 0, t = 0, n = 1, r = 1, i = 0, a = Math.PI * 2, o = !1, s = 0) {
		super(), this.isEllipseCurve = !0, this.type = "EllipseCurve", this.aX = e, this.aY = t, this.xRadius = n, this.yRadius = r, this.aStartAngle = i, this.aEndAngle = a, this.aClockwise = o, this.aRotation = s;
	}
	getPoint(e, t = new U()) {
		let n = t, r = Math.PI * 2, i = this.aEndAngle - this.aStartAngle, a = Math.abs(i) < 2 ** -52;
		for (; i < 0;) i += r;
		for (; i > r;) i -= r;
		i < 2 ** -52 && (i = a ? 0 : r), this.aClockwise === !0 && !a && (i === r ? i = -r : i -= r);
		let o = this.aStartAngle + e * i, s = this.aX + this.xRadius * Math.cos(o), c = this.aY + this.yRadius * Math.sin(o);
		if (this.aRotation !== 0) {
			let e = Math.cos(this.aRotation), t = Math.sin(this.aRotation), n = s - this.aX, r = c - this.aY;
			s = n * e - r * t + this.aX, c = n * t + r * e + this.aY;
		}
		return n.set(s, c);
	}
	copy(e) {
		return super.copy(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.aX = this.aX, e.aY = this.aY, e.xRadius = this.xRadius, e.yRadius = this.yRadius, e.aStartAngle = this.aStartAngle, e.aEndAngle = this.aEndAngle, e.aClockwise = this.aClockwise, e.aRotation = this.aRotation, e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.aX = e.aX, this.aY = e.aY, this.xRadius = e.xRadius, this.yRadius = e.yRadius, this.aStartAngle = e.aStartAngle, this.aEndAngle = e.aEndAngle, this.aClockwise = e.aClockwise, this.aRotation = e.aRotation, this;
	}
}, Da = class extends Ea {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, n, r, i, a), this.isArcCurve = !0, this.type = "ArcCurve";
	}
};
function Oa() {
	let e = 0, t = 0, n = 0, r = 0;
	function i(i, a, o, s) {
		e = i, t = o, n = -3 * i + 3 * a - 2 * o - s, r = 2 * i - 2 * a + o + s;
	}
	return {
		initCatmullRom: function(e, t, n, r, a) {
			i(t, n, a * (n - e), a * (r - t));
		},
		initNonuniformCatmullRom: function(e, t, n, r, a, o, s) {
			let c = (t - e) / a - (n - e) / (a + o) + (n - t) / o, l = (n - t) / o - (r - t) / (o + s) + (r - n) / s;
			c *= o, l *= o, i(t, n, c, l);
		},
		calc: function(i) {
			let a = i * i, o = a * i;
			return e + t * i + n * a + r * o;
		}
	};
}
var ka = /*@__PURE__*/ new W(), Aa = /*@__PURE__*/ new W(), ja = /*@__PURE__*/ new Oa(), Ma = /*@__PURE__*/ new Oa(), Na = /*@__PURE__*/ new Oa(), Pa = class extends Ta {
	constructor(e = [], t = !1, n = "centripetal", r = .5) {
		super(), this.isCatmullRomCurve3 = !0, this.type = "CatmullRomCurve3", this.points = e, this.closed = t, this.curveType = n, this.tension = r;
	}
	getPoint(e, t = new W()) {
		let n = t, r = this.points, i = r.length, a = (i - +!this.closed) * e, o = Math.floor(a), s = a - o;
		this.closed ? o += o > 0 ? 0 : (Math.floor(Math.abs(o) / i) + 1) * i : s === 0 && o === i - 1 && (o = i - 2, s = 1);
		let c, l;
		this.closed || o > 0 ? c = r[(o - 1) % i] : (Aa.subVectors(r[0], r[1]).add(r[0]), c = Aa);
		let u = r[o % i], d = r[(o + 1) % i];
		if (this.closed || o + 2 < i ? l = r[(o + 2) % i] : (ka.subVectors(r[i - 1], r[i - 2]).add(r[i - 1]), l = ka), this.curveType === "centripetal" || this.curveType === "chordal") {
			let e = this.curveType === "chordal" ? .5 : .25, t = c.distanceToSquared(u) ** +e, n = u.distanceToSquared(d) ** +e, r = d.distanceToSquared(l) ** +e;
			n < 1e-4 && (n = 1), t < 1e-4 && (t = n), r < 1e-4 && (r = n), ja.initNonuniformCatmullRom(c.x, u.x, d.x, l.x, t, n, r), Ma.initNonuniformCatmullRom(c.y, u.y, d.y, l.y, t, n, r), Na.initNonuniformCatmullRom(c.z, u.z, d.z, l.z, t, n, r);
		} else this.curveType === "catmullrom" && (ja.initCatmullRom(c.x, u.x, d.x, l.x, this.tension), Ma.initCatmullRom(c.y, u.y, d.y, l.y, this.tension), Na.initCatmullRom(c.z, u.z, d.z, l.z, this.tension));
		return n.set(ja.calc(s), Ma.calc(s), Na.calc(s)), n;
	}
	copy(e) {
		super.copy(e), this.points = [];
		for (let t = 0, n = e.points.length; t < n; t++) {
			let n = e.points[t];
			this.points.push(n.clone());
		}
		return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this;
	}
	toJSON() {
		let e = super.toJSON();
		e.points = [];
		for (let t = 0, n = this.points.length; t < n; t++) {
			let n = this.points[t];
			e.points.push(n.toArray());
		}
		return e.closed = this.closed, e.curveType = this.curveType, e.tension = this.tension, e;
	}
	fromJSON(e) {
		super.fromJSON(e), this.points = [];
		for (let t = 0, n = e.points.length; t < n; t++) {
			let n = e.points[t];
			this.points.push(new W().fromArray(n));
		}
		return this.closed = e.closed, this.curveType = e.curveType, this.tension = e.tension, this;
	}
};
function Fa(e, t, n, r, i) {
	let a = (r - t) * .5, o = (i - n) * .5, s = e * e, c = e * s;
	return (2 * n - 2 * r + a + o) * c + (-3 * n + 3 * r - 2 * a - o) * s + a * e + n;
}
function Ia(e, t) {
	let n = 1 - e;
	return n * n * t;
}
function La(e, t) {
	return 2 * (1 - e) * e * t;
}
function Ra(e, t) {
	return e * e * t;
}
function za(e, t, n, r) {
	return Ia(e, t) + La(e, n) + Ra(e, r);
}
function Ba(e, t) {
	let n = 1 - e;
	return n * n * n * t;
}
function Va(e, t) {
	let n = 1 - e;
	return 3 * n * n * e * t;
}
function Ha(e, t) {
	return 3 * (1 - e) * e * e * t;
}
function Ua(e, t) {
	return e * e * e * t;
}
function Wa(e, t, n, r, i) {
	return Ba(e, t) + Va(e, n) + Ha(e, r) + Ua(e, i);
}
var Ga = class extends Ta {
	constructor(e = new U(), t = new U(), n = new U(), r = new U()) {
		super(), this.isCubicBezierCurve = !0, this.type = "CubicBezierCurve", this.v0 = e, this.v1 = t, this.v2 = n, this.v3 = r;
	}
	getPoint(e, t = new U()) {
		let n = t, r = this.v0, i = this.v1, a = this.v2, o = this.v3;
		return n.set(Wa(e, r.x, i.x, a.x, o.x), Wa(e, r.y, i.y, a.y, o.y)), n;
	}
	copy(e) {
		return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this;
	}
}, Ka = class extends Ta {
	constructor(e = new W(), t = new W(), n = new W(), r = new W()) {
		super(), this.isCubicBezierCurve3 = !0, this.type = "CubicBezierCurve3", this.v0 = e, this.v1 = t, this.v2 = n, this.v3 = r;
	}
	getPoint(e, t = new W()) {
		let n = t, r = this.v0, i = this.v1, a = this.v2, o = this.v3;
		return n.set(Wa(e, r.x, i.x, a.x, o.x), Wa(e, r.y, i.y, a.y, o.y), Wa(e, r.z, i.z, a.z, o.z)), n;
	}
	copy(e) {
		return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this.v3.copy(e.v3), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e.v3 = this.v3.toArray(), e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this.v3.fromArray(e.v3), this;
	}
}, qa = class extends Ta {
	constructor(e = new U(), t = new U()) {
		super(), this.isLineCurve = !0, this.type = "LineCurve", this.v1 = e, this.v2 = t;
	}
	getPoint(e, t = new U()) {
		let n = t;
		return e === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(e).add(this.v1)), n;
	}
	getPointAt(e, t) {
		return this.getPoint(e, t);
	}
	getTangent(e, t = new U()) {
		return t.subVectors(this.v2, this.v1).normalize();
	}
	getTangentAt(e, t) {
		return this.getTangent(e, t);
	}
	copy(e) {
		return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
	}
}, Ja = class extends Ta {
	constructor(e = new W(), t = new W()) {
		super(), this.isLineCurve3 = !0, this.type = "LineCurve3", this.v1 = e, this.v2 = t;
	}
	getPoint(e, t = new W()) {
		let n = t;
		return e === 1 ? n.copy(this.v2) : (n.copy(this.v2).sub(this.v1), n.multiplyScalar(e).add(this.v1)), n;
	}
	getPointAt(e, t) {
		return this.getPoint(e, t);
	}
	getTangent(e, t = new W()) {
		return t.subVectors(this.v2, this.v1).normalize();
	}
	getTangentAt(e, t) {
		return this.getTangent(e, t);
	}
	copy(e) {
		return super.copy(e), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
	}
}, Ya = class extends Ta {
	constructor(e = new U(), t = new U(), n = new U()) {
		super(), this.isQuadraticBezierCurve = !0, this.type = "QuadraticBezierCurve", this.v0 = e, this.v1 = t, this.v2 = n;
	}
	getPoint(e, t = new U()) {
		let n = t, r = this.v0, i = this.v1, a = this.v2;
		return n.set(za(e, r.x, i.x, a.x), za(e, r.y, i.y, a.y)), n;
	}
	copy(e) {
		return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
	}
}, Xa = class extends Ta {
	constructor(e = new W(), t = new W(), n = new W()) {
		super(), this.isQuadraticBezierCurve3 = !0, this.type = "QuadraticBezierCurve3", this.v0 = e, this.v1 = t, this.v2 = n;
	}
	getPoint(e, t = new W()) {
		let n = t, r = this.v0, i = this.v1, a = this.v2;
		return n.set(za(e, r.x, i.x, a.x), za(e, r.y, i.y, a.y), za(e, r.z, i.z, a.z)), n;
	}
	copy(e) {
		return super.copy(e), this.v0.copy(e.v0), this.v1.copy(e.v1), this.v2.copy(e.v2), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.v0 = this.v0.toArray(), e.v1 = this.v1.toArray(), e.v2 = this.v2.toArray(), e;
	}
	fromJSON(e) {
		return super.fromJSON(e), this.v0.fromArray(e.v0), this.v1.fromArray(e.v1), this.v2.fromArray(e.v2), this;
	}
}, Za = /*#__PURE__*/ Object.freeze({
	__proto__: null,
	ArcCurve: Da,
	CatmullRomCurve3: Pa,
	CubicBezierCurve: Ga,
	CubicBezierCurve3: Ka,
	EllipseCurve: Ea,
	LineCurve: qa,
	LineCurve3: Ja,
	QuadraticBezierCurve: Ya,
	QuadraticBezierCurve3: Xa,
	SplineCurve: class extends Ta {
		constructor(e = []) {
			super(), this.isSplineCurve = !0, this.type = "SplineCurve", this.points = e;
		}
		getPoint(e, t = new U()) {
			let n = t, r = this.points, i = (r.length - 1) * e, a = Math.floor(i), o = i - a, s = r[a === 0 ? a : a - 1], c = r[a], l = r[a > r.length - 2 ? r.length - 1 : a + 1], u = r[a > r.length - 3 ? r.length - 1 : a + 2];
			return n.set(Fa(o, s.x, c.x, l.x, u.x), Fa(o, s.y, c.y, l.y, u.y)), n;
		}
		copy(e) {
			super.copy(e), this.points = [];
			for (let t = 0, n = e.points.length; t < n; t++) {
				let n = e.points[t];
				this.points.push(n.clone());
			}
			return this;
		}
		toJSON() {
			let e = super.toJSON();
			e.points = [];
			for (let t = 0, n = this.points.length; t < n; t++) {
				let n = this.points[t];
				e.points.push(n.toArray());
			}
			return e;
		}
		fromJSON(e) {
			super.fromJSON(e), this.points = [];
			for (let t = 0, n = e.points.length; t < n; t++) {
				let n = e.points[t];
				this.points.push(new U().fromArray(n));
			}
			return this;
		}
	}
}), Qa = class e extends Or {
	constructor(e = 1, t = 1, n = 1, r = 1) {
		super(), this.type = "PlaneGeometry", this.parameters = {
			width: e,
			height: t,
			widthSegments: n,
			heightSegments: r
		};
		let i = e / 2, a = t / 2, o = Math.floor(n), s = Math.floor(r), c = o + 1, l = s + 1, u = e / o, d = t / s, f = [], p = [], m = [], h = [];
		for (let e = 0; e < l; e++) {
			let t = e * d - a;
			for (let n = 0; n < c; n++) {
				let r = n * u - i;
				p.push(r, -t, 0), m.push(0, 0, 1), h.push(n / o), h.push(1 - e / s);
			}
		}
		for (let e = 0; e < s; e++) for (let t = 0; t < o; t++) {
			let n = t + c * e, r = t + c * (e + 1), i = t + 1 + c * (e + 1), a = t + 1 + c * e;
			f.push(n, r, a), f.push(r, i, a);
		}
		this.setIndex(f), this.setAttribute("position", new gr(p, 3)), this.setAttribute("normal", new gr(m, 3)), this.setAttribute("uv", new gr(h, 2));
	}
	copy(e) {
		return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
	}
	static fromJSON(t) {
		return new e(t.width, t.height, t.widthSegments, t.heightSegments);
	}
}, $a = class e extends Or {
	constructor(e = new Xa(new W(-1, -1, 0), new W(-1, 1, 0), new W(1, 1, 0)), t = 64, n = 1, r = 8, i = !1) {
		super(), this.type = "TubeGeometry", this.parameters = {
			path: e,
			tubularSegments: t,
			radius: n,
			radialSegments: r,
			closed: i
		};
		let a = e.computeFrenetFrames(t, i);
		this.tangents = a.tangents, this.normals = a.normals, this.binormals = a.binormals;
		let o = new W(), s = new W(), c = new U(), l = new W(), u = [], d = [], f = [], p = [];
		m(), this.setIndex(p), this.setAttribute("position", new gr(u, 3)), this.setAttribute("normal", new gr(d, 3)), this.setAttribute("uv", new gr(f, 2));
		function m() {
			for (let e = 0; e < t; e++) h(e);
			h(i === !1 ? t : 0), _(), g();
		}
		function h(i) {
			l = e.getPointAt(i / t, l);
			let c = a.normals[i], f = a.binormals[i];
			for (let e = 0; e <= r; e++) {
				let t = e / r * Math.PI * 2, i = Math.sin(t), a = -Math.cos(t);
				s.x = a * c.x + i * f.x, s.y = a * c.y + i * f.y, s.z = a * c.z + i * f.z, s.normalize(), d.push(s.x, s.y, s.z), o.x = l.x + n * s.x, o.y = l.y + n * s.y, o.z = l.z + n * s.z, u.push(o.x, o.y, o.z);
			}
		}
		function g() {
			for (let e = 1; e <= t; e++) for (let t = 1; t <= r; t++) {
				let n = (r + 1) * (e - 1) + (t - 1), i = (r + 1) * e + (t - 1), a = (r + 1) * e + t, o = (r + 1) * (e - 1) + t;
				p.push(n, i, o), p.push(i, a, o);
			}
		}
		function _() {
			for (let e = 0; e <= t; e++) for (let n = 0; n <= r; n++) c.x = e / t, c.y = n / r, f.push(c.x, c.y);
		}
	}
	copy(e) {
		return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.path = this.parameters.path.toJSON(), e;
	}
	static fromJSON(t) {
		return new e(new Za[t.path.type]().fromJSON(t.path), t.tubularSegments, t.radius, t.radialSegments, t.closed);
	}
};
function eo(e) {
	let t = {};
	for (let n in e) {
		t[n] = {};
		for (let r in e[n]) {
			let i = e[n][r];
			if (no(i)) i.isRenderTargetTexture ? (B("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[n][r] = null) : t[n][r] = i.clone();
			else if (Array.isArray(i)) {
				if (no(i[0])) {
					let e = [];
					for (let t = 0, n = i.length; t < n; t++) e[t] = i[t].clone();
					t[n][r] = e;
				} else t[n][r] = i.slice();
			} else t[n][r] = i;
		}
	}
	return t;
}
function to(e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = eo(e[n]);
		for (let e in r) t[e] = r[e];
	}
	return t;
}
function no(e) {
	return e && (e.isColor || e.isMatrix3 || e.isMatrix4 || e.isVector2 || e.isVector3 || e.isVector4 || e.isTexture || e.isQuaternion);
}
function ro(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(e[n].clone());
	return t;
}
function io(e) {
	let t = e.getRenderTarget();
	return t === null ? e.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : K.workingColorSpace;
}
var ao = {
	clone: eo,
	merge: to
}, oo = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", so = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", co = class extends Lr {
	constructor(e) {
		super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = oo, this.fragmentShader = so, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
			clipCullDistance: !1,
			multiDraw: !1
		}, this.defaultAttributeValues = {
			color: [
				1,
				1,
				1
			],
			uv: [0, 0],
			uv1: [0, 0]
		}, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = eo(e.uniforms), this.uniformsGroups = ro(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this.defaultAttributeValues = Object.assign({}, e.defaultAttributeValues), this.index0AttributeName = e.index0AttributeName, this.uniformsNeedUpdate = e.uniformsNeedUpdate, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		t.glslVersion = this.glslVersion, t.uniforms = {};
		for (let n in this.uniforms) {
			let r = this.uniforms[n].value;
			r && r.isTexture ? t.uniforms[n] = {
				type: "t",
				value: r.toJSON(e).uuid
			} : r && r.isColor ? t.uniforms[n] = {
				type: "c",
				value: r.getHex()
			} : r && r.isVector2 ? t.uniforms[n] = {
				type: "v2",
				value: r.toArray()
			} : r && r.isVector3 ? t.uniforms[n] = {
				type: "v3",
				value: r.toArray()
			} : r && r.isVector4 ? t.uniforms[n] = {
				type: "v4",
				value: r.toArray()
			} : r && r.isMatrix3 ? t.uniforms[n] = {
				type: "m3",
				value: r.toArray()
			} : r && r.isMatrix4 ? t.uniforms[n] = {
				type: "m4",
				value: r.toArray()
			} : t.uniforms[n] = { value: r };
		}
		Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
		let n = {};
		for (let e in this.extensions) this.extensions[e] === !0 && (n[e] = !0);
		return Object.keys(n).length > 0 && (t.extensions = n), t;
	}
	fromJSON(e, t) {
		if (super.fromJSON(e, t), e.uniforms !== void 0) for (let n in e.uniforms) {
			let r = e.uniforms[n];
			switch (this.uniforms[n] = {}, r.type) {
				case "t":
					this.uniforms[n].value = t[r.value] || null;
					break;
				case "c":
					this.uniforms[n].value = new J().setHex(r.value);
					break;
				case "v2":
					this.uniforms[n].value = new U().fromArray(r.value);
					break;
				case "v3":
					this.uniforms[n].value = new W().fromArray(r.value);
					break;
				case "v4":
					this.uniforms[n].value = new qt().fromArray(r.value);
					break;
				case "m3":
					this.uniforms[n].value = new G().fromArray(r.value);
					break;
				case "m4":
					this.uniforms[n].value = new q().fromArray(r.value);
					break;
				default: this.uniforms[n].value = r.value;
			}
		}
		if (e.defines !== void 0 && (this.defines = e.defines), e.vertexShader !== void 0 && (this.vertexShader = e.vertexShader), e.fragmentShader !== void 0 && (this.fragmentShader = e.fragmentShader), e.glslVersion !== void 0 && (this.glslVersion = e.glslVersion), e.extensions !== void 0) for (let t in e.extensions) this.extensions[t] = e.extensions[t];
		return e.lights !== void 0 && (this.lights = e.lights), e.clipping !== void 0 && (this.clipping = e.clipping), this;
	}
}, lo = class extends co {
	constructor(e) {
		super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
	}
}, uo = class extends Lr {
	constructor(e) {
		super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new J(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new J(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new U(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new cn(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
	}
}, fo = class extends uo {
	constructor(e) {
		super(), this.isMeshPhysicalMaterial = !0, this.defines = {
			STANDARD: "",
			PHYSICAL: ""
		}, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new U(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
			get: function() {
				return H(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
			},
			set: function(e) {
				this.ior = (1 + .4 * e) / (1 - .4 * e);
			}
		}), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new J(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = Infinity, this.attenuationColor = new J(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new J(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._retroreflectivity = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
	}
	get anisotropy() {
		return this._anisotropy;
	}
	set anisotropy(e) {
		this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
	}
	get clearcoat() {
		return this._clearcoat;
	}
	set clearcoat(e) {
		this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
	}
	get iridescence() {
		return this._iridescence;
	}
	set iridescence(e) {
		this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
	}
	get dispersion() {
		return this._dispersion;
	}
	set dispersion(e) {
		this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
	}
	get retroreflectivity() {
		return this._retroreflectivity;
	}
	set retroreflectivity(e) {
		this._retroreflectivity > 0 != e > 0 && this.version++, this._retroreflectivity = e;
	}
	get sheen() {
		return this._sheen;
	}
	set sheen(e) {
		this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
	}
	get transmission() {
		return this._transmission;
	}
	set transmission(e) {
		this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
	}
	copy(e) {
		return super.copy(e), this.defines = {
			STANDARD: "",
			PHYSICAL: ""
		}, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.retroreflectivity = e.retroreflectivity, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
	}
}, po = class extends Lr {
	constructor(e) {
		super(), this.isMeshLambertMaterial = !0, this.type = "MeshLambertMaterial", this.color = new J(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new J(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new U(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new cn(), this.combine = 0, this.reflectivity = 1, this.envMapIntensity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.envMapIntensity = e.envMapIntensity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
	}
}, mo = class extends Lr {
	constructor(e) {
		super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = ze, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
	}
}, ho = class extends Lr {
	constructor(e) {
		super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
	}
};
function go(e, t) {
	return !e || e.constructor === t ? e : typeof t.BYTES_PER_ELEMENT == "number" ? new t(e) : Array.prototype.slice.call(e);
}
function _o(e) {
	return e !== void 0 && e.inTangents !== void 0 && e.outTangents !== void 0;
}
function vo(e) {
	function t(t, n) {
		return e[t] - e[n];
	}
	let n = e.length, r = Array(n);
	for (let e = 0; e !== n; ++e) r[e] = e;
	return r.sort(t), r;
}
function yo(e, t, n) {
	let r = e.length, i = new e.constructor(r);
	for (let a = 0, o = 0; o !== r; ++a) {
		let r = n[a] * t;
		for (let n = 0; n !== t; ++n) i[o++] = e[r + n];
	}
	return i;
}
function bo(e, t, n, r) {
	let i = 1, a = e[0];
	for (; a !== void 0 && a[r] === void 0;) a = e[i++];
	if (a === void 0) return;
	let o = a[r];
	if (o !== void 0) {
		if (Array.isArray(o)) do
			o = a[r], o !== void 0 && (t.push(a.time), n.push(...o)), a = e[i++];
		while (a !== void 0);
		else if (o.toArray !== void 0) do
			o = a[r], o !== void 0 && (t.push(a.time), o.toArray(n, n.length)), a = e[i++];
		while (a !== void 0);
		else do
			o = a[r], o !== void 0 && (t.push(a.time), n.push(o)), a = e[i++];
		while (a !== void 0);
	}
}
var xo = class {
	constructor(e, t, n, r) {
		this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = r === void 0 ? new t.constructor(n) : r, this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
	}
	evaluate(e) {
		let t = this.parameterPositions, n = this._cachedIndex, r = t[n], i = t[n - 1];
		validate_interval: {
			seek: {
				let a;
				linear_scan: {
					forward_scan: if (!(e < r)) {
						for (let a = n + 2;;) {
							if (r === void 0) {
								if (e < i) break forward_scan;
								return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
							}
							if (n === a) break;
							if (i = r, r = t[++n], e < r) break seek;
						}
						a = t.length;
						break linear_scan;
					}
					if (!(e >= i)) {
						let o = t[1];
						e < o && (n = 2, i = o);
						for (let a = n - 2;;) {
							if (i === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
							if (n === a) break;
							if (r = i, i = t[--n - 1], e >= i) break seek;
						}
						a = n, n = 0;
						break linear_scan;
					}
					break validate_interval;
				}
				for (; n < a;) {
					let r = n + a >>> 1;
					e < t[r] ? a = r : n = r + 1;
				}
				if (r = t[n], i = t[n - 1], i === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
				if (r === void 0) return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
			}
			this._cachedIndex = n, this.intervalChanged_(n, i, r);
		}
		return this.interpolate_(n, i, e, r);
	}
	getSettings_() {
		return this.settings || this.DefaultSettings_;
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r;
		for (let e = 0; e !== r; ++e) t[e] = n[i + e];
		return t;
	}
	interpolate_() {
		throw Error("THREE.Interpolant: Call to abstract method.");
	}
	intervalChanged_() {}
}, So = class extends xo {
	constructor(e, t, n, r) {
		super(e, t, n, r), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
			endingStart: R,
			endingEnd: R
		};
	}
	intervalChanged_(e, t, n) {
		let r = this.parameterPositions, i = e - 2, a = e + 1, o = r[i], s = r[a];
		if (o === void 0) switch (this.getSettings_().endingStart) {
			case z:
				i = e, o = 2 * t - n;
				break;
			case Le:
				i = r.length - 2, o = t + r[i] - r[i + 1];
				break;
			default: i = e, o = n;
		}
		if (s === void 0) switch (this.getSettings_().endingEnd) {
			case z:
				a = e, s = 2 * n - t;
				break;
			case Le:
				a = 1, s = n + r[1] - r[0];
				break;
			default: a = e - 1, s = t;
		}
		let c = (n - t) * .5, l = this.valueSize;
		this._weightPrev = c / (t - o), this._weightNext = c / (s - n), this._offsetPrev = i * l, this._offsetNext = a * l;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, f = this._weightNext, p = (n - t) / (r - t), m = p * p, h = m * p, g = -d * h + 2 * d * m - d * p, _ = (1 + d) * h + (-1.5 - 2 * d) * m + (-.5 + d) * p + 1, v = (-1 - f) * h + (1.5 + f) * m + .5 * p, y = f * h - f * m;
		for (let e = 0; e !== o; ++e) i[e] = g * a[l + e] + _ * a[c + e] + v * a[s + e] + y * a[u + e];
		return i;
	}
}, Co = class extends xo {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = (n - t) / (r - t), u = 1 - l;
		for (let e = 0; e !== o; ++e) i[e] = a[c + e] * u + a[s + e] * l;
		return i;
	}
}, wo = class extends xo {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	interpolate_(e) {
		return this.copySampleValue_(e - 1);
	}
}, To = class extends xo {
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = this.inTangents, u = this.outTangents;
		if (!l || !u) {
			let e = (n - t) / (r - t), l = 1 - e;
			for (let t = 0; t !== o; ++t) i[t] = a[c + t] * l + a[s + t] * e;
			return i;
		}
		let d = o * 2, f = e - 1;
		for (let p = 0; p !== o; ++p) {
			let o = a[c + p], m = a[s + p], h = f * d + p * 2, g = u[h], _ = u[h + 1], v = e * d + p * 2, y = l[v], b = l[v + 1], x = Oo(n, t, g, y, r);
			i[p] = Eo(x, o, _, b, m);
		}
		return i;
	}
};
function Eo(e, t, n, r, i) {
	let a = 1 - e;
	return a * a * a * t + 3 * a * a * e * n + 3 * a * e * e * r + e * e * e * i;
}
function Do(e, t, n, r, i) {
	let a = 1 - e;
	return 3 * a * a * (n - t) + 6 * a * e * (r - n) + 3 * e * e * (i - r);
}
function Oo(e, t, n, r, i) {
	let a = (e - t) / (i - t);
	for (let o = 0; o < 8; o++) {
		let o = Eo(a, t, n, r, i) - e;
		if (Math.abs(o) < 1e-10) break;
		let s = Do(a, t, n, r, i);
		if (Math.abs(s) < 1e-10) break;
		a = Math.max(0, Math.min(1, a - o / s));
	}
	return a;
}
var ko = class {
	constructor(e, t, n, r) {
		if (e === void 0) throw Error("THREE.KeyframeTrack: track name is undefined");
		if (t === void 0 || t.length === 0) throw Error("THREE.KeyframeTrack: no keyframes in track named " + e);
		this.name = e, this.times = go(t, this.TimeBufferType), this.values = go(n, this.ValueBufferType), this.setInterpolation(r || this.DefaultInterpolation);
	}
	static toJSON(e) {
		let t = e.constructor, n;
		if (t.toJSON !== this.toJSON) n = t.toJSON(e);
		else {
			n = {
				name: e.name,
				times: go(e.times, Array),
				values: go(e.values, Array)
			};
			let t = e.getInterpolation();
			t !== e.DefaultInterpolation && (n.interpolation = t), _o(e.settings) && (n.settings = {
				inTangents: go(e.settings.inTangents, Array),
				outTangents: go(e.settings.outTangents, Array)
			});
		}
		return n.type = e.ValueTypeName, n;
	}
	InterpolantFactoryMethodDiscrete(e) {
		return new wo(this.times, this.values, this.getValueSize(), e);
	}
	InterpolantFactoryMethodLinear(e) {
		return new Co(this.times, this.values, this.getValueSize(), e);
	}
	InterpolantFactoryMethodSmooth(e) {
		return new So(this.times, this.values, this.getValueSize(), e);
	}
	InterpolantFactoryMethodBezier(e) {
		let t = new To(this.times, this.values, this.getValueSize(), e);
		return this.settings && (t.inTangents = this.settings.inTangents, t.outTangents = this.settings.outTangents), t;
	}
	setInterpolation(e) {
		let t;
		switch (e) {
			case Pe:
				t = this.InterpolantFactoryMethodDiscrete;
				break;
			case Fe:
				t = this.InterpolantFactoryMethodLinear;
				break;
			case L:
				t = this.InterpolantFactoryMethodSmooth;
				break;
			case Ie: t = this.InterpolantFactoryMethodBezier;
		}
		if (t === void 0) {
			let t = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
			if (this.createInterpolant === void 0) {
				if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
				else throw Error(t);
			}
			return B("KeyframeTrack:", t), this;
		}
		return this.createInterpolant = t, this;
	}
	getInterpolation() {
		switch (this.createInterpolant) {
			case this.InterpolantFactoryMethodDiscrete: return Pe;
			case this.InterpolantFactoryMethodLinear: return Fe;
			case this.InterpolantFactoryMethodSmooth: return L;
			case this.InterpolantFactoryMethodBezier: return Ie;
		}
	}
	getValueSize() {
		return this.values.length / this.times.length;
	}
	shift(e) {
		if (e !== 0) {
			let t = this.times;
			for (let n = 0, r = t.length; n !== r; ++n) t[n] += e;
		}
		return this;
	}
	scale(e) {
		if (e !== 1) {
			let t = this.times;
			for (let n = 0, r = t.length; n !== r; ++n) t[n] *= e;
			_o(this.settings) && (Ao(this.settings.inTangents, e), Ao(this.settings.outTangents, e));
		}
		return this;
	}
	trim(e, t) {
		let n = this.times, r = n.length, i = 0, a = r - 1;
		for (; i !== r && n[i] < e;) ++i;
		for (; a !== -1 && n[a] > t;) --a;
		if (++a, i !== 0 || a !== r) {
			i >= a && (a = Math.max(a, 1), i = a - 1);
			let e = this.getValueSize();
			this.times = n.slice(i, a), this.values = this.values.slice(i * e, a * e);
		}
		return this;
	}
	validate() {
		let e = !0, t = this.getValueSize();
		t - Math.floor(t) !== 0 && (V("KeyframeTrack: Invalid value size in track.", this), e = !1);
		let n = this.times, r = this.values, i = n.length;
		i === 0 && (V("KeyframeTrack: Track is empty.", this), e = !1);
		let a = null;
		for (let t = 0; t !== i; t++) {
			let r = n[t];
			if (typeof r == "number" && isNaN(r)) {
				V("KeyframeTrack: Time is not a valid number.", this, t, r), e = !1;
				break;
			}
			if (a !== null && a > r) {
				V("KeyframeTrack: Out of order keys.", this, t, r, a), e = !1;
				break;
			}
			a = r;
		}
		if (r !== void 0 && Je(r)) for (let t = 0, n = r.length; t !== n; ++t) {
			let n = r[t];
			if (isNaN(n)) {
				V("KeyframeTrack: Value is not a valid number.", this, t, n), e = !1;
				break;
			}
		}
		return e;
	}
	optimize() {
		let e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), r = this.getInterpolation() === L, i = e.length - 1, a = 1;
		for (let o = 1; o < i; ++o) {
			let i = !1, s = e[o];
			if (s !== e[o + 1] && (o !== 1 || s !== e[0])) {
				if (r) i = !0;
				else {
					let e = o * n, r = e - n, a = e + n;
					for (let o = 0; o !== n; ++o) {
						let n = t[e + o];
						if (n !== t[r + o] || n !== t[a + o]) {
							i = !0;
							break;
						}
					}
				}
			}
			if (i) {
				if (o !== a) {
					e[a] = e[o];
					let r = o * n, i = a * n;
					for (let e = 0; e !== n; ++e) t[i + e] = t[r + e];
				}
				++a;
			}
		}
		if (i > 0) {
			e[a] = e[i];
			for (let e = i * n, r = a * n, o = 0; o !== n; ++o) t[r + o] = t[e + o];
			++a;
		}
		return a === e.length ? (this.times = e, this.values = t) : (this.times = e.slice(0, a), this.values = t.slice(0, a * n)), this;
	}
	clone() {
		let e = this.times.slice(), t = this.values.slice(), n = this.constructor, r = new n(this.name, e, t);
		return r.createInterpolant = this.createInterpolant, _o(this.settings) && (r.settings = {
			inTangents: this.settings.inTangents.slice(),
			outTangents: this.settings.outTangents.slice()
		}), r;
	}
};
function Ao(e, t) {
	for (let n = 0, r = e.length; n !== r; n += 2) e[n] *= t;
}
ko.prototype.ValueTypeName = "", ko.prototype.TimeBufferType = Float32Array, ko.prototype.ValueBufferType = Float32Array, ko.prototype.DefaultInterpolation = Fe;
var jo = class extends ko {
	constructor(e, t, n) {
		super(e, t, n);
	}
};
jo.prototype.ValueTypeName = "bool", jo.prototype.ValueBufferType = Array, jo.prototype.DefaultInterpolation = Pe, jo.prototype.InterpolantFactoryMethodLinear = void 0, jo.prototype.InterpolantFactoryMethodSmooth = void 0;
var Mo = class extends ko {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
};
Mo.prototype.ValueTypeName = "color";
var No = class extends ko {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
};
No.prototype.ValueTypeName = "number";
var Po = class extends xo {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = (n - t) / (r - t), c = e * o;
		for (let e = c + o; c !== e; c += 4) At.slerpFlat(i, 0, a, c - o, a, c, s);
		return i;
	}
}, Fo = class extends ko {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	InterpolantFactoryMethodLinear(e) {
		return new Po(this.times, this.values, this.getValueSize(), e);
	}
};
Fo.prototype.ValueTypeName = "quaternion", Fo.prototype.InterpolantFactoryMethodSmooth = void 0;
var Io = class extends ko {
	constructor(e, t, n) {
		super(e, t, n);
	}
};
Io.prototype.ValueTypeName = "string", Io.prototype.ValueBufferType = Array, Io.prototype.DefaultInterpolation = Pe, Io.prototype.InterpolantFactoryMethodLinear = void 0, Io.prototype.InterpolantFactoryMethodSmooth = void 0;
var Lo = class extends ko {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
};
Lo.prototype.ValueTypeName = "vector";
var Ro = class {
	constructor(e = "", t = -1, n = [], r = Re) {
		this.name = e, this.tracks = n, this.duration = t, this.blendMode = r, this.uuid = ct(), this.userData = {}, this.duration < 0 && this.resetDuration();
	}
	static parse(e) {
		let t = [], n = e.tracks, r = 1 / (e.fps || 1);
		for (let e = 0, i = n.length; e !== i; ++e) t.push(Bo(n[e]).scale(r));
		let i = new this(e.name, e.duration, t, e.blendMode);
		return i.uuid = e.uuid, i.userData = JSON.parse(e.userData || "{}"), i;
	}
	static toJSON(e) {
		let t = [], n = e.tracks, r = {
			name: e.name,
			duration: e.duration,
			tracks: t,
			uuid: e.uuid,
			blendMode: e.blendMode,
			userData: JSON.stringify(e.userData)
		};
		for (let e = 0, r = n.length; e !== r; ++e) t.push(ko.toJSON(n[e]));
		return r;
	}
	static CreateFromMorphTargetSequence(e, t, n, r) {
		let i = t.length, a = [];
		for (let e = 0; e < i; e++) {
			let o = [], s = [];
			o.push((e + i - 1) % i, e, (e + 1) % i), s.push(0, 1, 0);
			let c = vo(o);
			o = yo(o, 1, c), s = yo(s, 1, c), !r && o[0] === 0 && (o.push(i), s.push(s[0])), a.push(new No(".morphTargetInfluences[" + t[e].name + "]", o, s).scale(1 / n));
		}
		return new this(e, -1, a);
	}
	static findByName(e, t) {
		let n = e;
		if (!Array.isArray(e)) {
			let t = e;
			n = t.geometry && t.geometry.animations || t.animations;
		}
		for (let e = 0; e < n.length; e++) if (n[e].name === t) return n[e];
		return null;
	}
	static CreateClipsFromMorphTargetSequences(e, t, n) {
		let r = {}, i = /^([\w-]*?)([\d]+)$/;
		for (let t = 0, n = e.length; t < n; t++) {
			let n = e[t], a = n.name.match(i);
			if (a && a.length > 1) {
				let e = a[1], t = r[e];
				t || (r[e] = t = []), t.push(n);
			}
		}
		let a = [];
		for (let e in r) a.push(this.CreateFromMorphTargetSequence(e, r[e], t, n));
		return a;
	}
	resetDuration() {
		let e = this.tracks, t = 0;
		for (let n = 0, r = e.length; n !== r; ++n) {
			let e = this.tracks[n];
			t = Math.max(t, e.times[e.times.length - 1]);
		}
		return this.duration = t, this;
	}
	trim() {
		for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
		return this;
	}
	validate() {
		let e = !0;
		for (let t = 0; t < this.tracks.length; t++) e &&= this.tracks[t].validate();
		return e;
	}
	optimize() {
		for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
		return this;
	}
	clone() {
		let e = [];
		for (let t = 0; t < this.tracks.length; t++) e.push(this.tracks[t].clone());
		let t = new this.constructor(this.name, this.duration, e, this.blendMode);
		return t.userData = JSON.parse(JSON.stringify(this.userData)), t;
	}
	toJSON() {
		return this.constructor.toJSON(this);
	}
};
function zo(e) {
	switch (e.toLowerCase()) {
		case "scalar":
		case "double":
		case "float":
		case "number":
		case "integer": return No;
		case "vector":
		case "vector2":
		case "vector3":
		case "vector4": return Lo;
		case "color": return Mo;
		case "quaternion": return Fo;
		case "bool":
		case "boolean": return jo;
		case "string": return Io;
	}
	throw Error("THREE.KeyframeTrack: Unsupported typeName: " + e);
}
function Bo(e) {
	if (e.type === void 0) throw Error("THREE.KeyframeTrack: track type undefined, can not parse");
	let t = zo(e.type);
	if (e.times === void 0) {
		let t = [], n = [];
		bo(e.keys, t, n, "value"), e.times = t, e.values = n;
	}
	let n;
	return n = t.parse === void 0 ? new t(e.name, e.times, e.values, e.interpolation) : t.parse(e), _o(e.settings) && (n.settings = {
		inTangents: go(e.settings.inTangents, Float32Array),
		outTangents: go(e.settings.outTangents, Float32Array)
	}), n;
}
var Vo = {
	enabled: !1,
	files: {},
	add: function(e, t) {
		this.enabled !== !1 && (Ho(e) || (this.files[e] = t));
	},
	get: function(e) {
		if (this.enabled !== !1 && !Ho(e)) return this.files[e];
	},
	remove: function(e) {
		delete this.files[e];
	},
	clear: function() {
		this.files = {};
	}
};
function Ho(e) {
	try {
		let t = e.slice(e.indexOf(":") + 1);
		return new URL(t).protocol === "blob:";
	} catch {
		return !1;
	}
}
var Uo = /*@__PURE__*/ new class {
	constructor(e, t, n) {
		let r = this, i = !1, a = 0, o = 0, s, c = [];
		this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this._abortController = null, this.itemStart = function(e) {
			o++, i === !1 && r.onStart !== void 0 && r.onStart(e, a, o), i = !0;
		}, this.itemEnd = function(e) {
			a++, r.onProgress !== void 0 && r.onProgress(e, a, o), a === o && (i = !1, r.onLoad !== void 0 && r.onLoad());
		}, this.itemError = function(e) {
			r.onError !== void 0 && r.onError(e);
		}, this.resolveURL = function(e) {
			return e = e.normalize("NFC"), s ? s(e) : e;
		}, this.setURLModifier = function(e) {
			return s = e, this;
		}, this.addHandler = function(e, t) {
			return c.push(e, t), this;
		}, this.removeHandler = function(e) {
			let t = c.indexOf(e);
			return t !== -1 && c.splice(t, 2), this;
		}, this.getHandler = function(e) {
			for (let t = 0, n = c.length; t < n; t += 2) {
				let n = c[t], r = c[t + 1];
				if (n.global && (n.lastIndex = 0), n.test(e)) return r;
			}
			return null;
		}, this.abort = function() {
			return this.abortController.abort(), this._abortController = null, this;
		};
	}
	get abortController() {
		return this._abortController ||= new AbortController(), this._abortController;
	}
}(), Wo = class {
	constructor(e) {
		this.manager = e === void 0 ? Uo : e, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	load() {}
	loadAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.load(e, r, t, i);
		});
	}
	parse() {}
	setCrossOrigin(e) {
		return this.crossOrigin = e, this;
	}
	setWithCredentials(e) {
		return this.withCredentials = e, this;
	}
	setPath(e) {
		return this.path = e, this;
	}
	setResourcePath(e) {
		return this.resourcePath = e, this;
	}
	setRequestHeader(e) {
		return this.requestHeader = e, this;
	}
	abort() {
		return this;
	}
};
Wo.DEFAULT_MATERIAL_NAME = "__DEFAULT";
var Go = {}, Ko = class extends Error {
	constructor(e, t) {
		super(e), this.response = t;
	}
}, qo = class extends Wo {
	constructor(e) {
		super(e), this.mimeType = "", this.responseType = "", this._abortController = new AbortController();
	}
	load(e, t, n, r) {
		e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
		let i = Vo.get(`file:${e}`);
		if (i !== void 0) {
			this.manager.itemStart(e), setTimeout(() => {
				t && t(i), this.manager.itemEnd(e);
			}, 0);
			return;
		}
		if (Go[e] !== void 0) {
			Go[e].push({
				onLoad: t,
				onProgress: n,
				onError: r
			});
			return;
		}
		Go[e] = [], Go[e].push({
			onLoad: t,
			onProgress: n,
			onError: r
		});
		let a = new Request(e, {
			headers: new Headers(this.requestHeader),
			credentials: this.withCredentials ? "include" : "same-origin",
			signal: typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal
		}), o = this.mimeType, s = this.responseType;
		fetch(a).then((t) => {
			if (t.status === 200 || t.status === 0) {
				if (t.status === 0 && B("FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || t.body === void 0 || t.body.getReader === void 0) return t;
				let n = Go[e], r = t.body.getReader(), i = t.headers.get("X-File-Size") || t.headers.get("Content-Length"), a = i ? parseInt(i) : 0, o = a !== 0, s = 0, c = new ReadableStream({ start(e) {
					t();
					function t() {
						r.read().then(({ done: r, value: i }) => {
							if (r) e.close();
							else {
								s += i.byteLength;
								let r = new ProgressEvent("progress", {
									lengthComputable: o,
									loaded: s,
									total: a
								});
								for (let e = 0, t = n.length; e < t; e++) {
									let t = n[e];
									t.onProgress && t.onProgress(r);
								}
								e.enqueue(i), t();
							}
						}, (t) => {
							e.error(t);
						});
					}
				} });
				return new Response(c);
			}
			throw new Ko(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`, t);
		}).then((e) => {
			switch (s) {
				case "arraybuffer": return e.arrayBuffer();
				case "blob": return e.blob();
				case "document": return e.text().then((e) => new DOMParser().parseFromString(e, o));
				case "json": return e.json();
				default:
					if (o === "") return e.text();
					{
						let t = /charset="?([^;"\s]*)"?/i.exec(o), n = t && t[1] ? t[1].toLowerCase() : void 0, r = new TextDecoder(n);
						return e.arrayBuffer().then((e) => r.decode(e));
					}
			}
		}).then((t) => {
			Vo.add(`file:${e}`, t);
			let n = Go[e];
			delete Go[e];
			for (let e = 0, r = n.length; e < r; e++) {
				let r = n[e];
				r.onLoad && r.onLoad(t);
			}
		}).catch((t) => {
			let n = Go[e];
			if (n === void 0) throw this.manager.itemError(e), t;
			delete Go[e];
			for (let e = 0, r = n.length; e < r; e++) {
				let r = n[e];
				r.onError && r.onError(t);
			}
			this.manager.itemError(e);
		}).finally(() => {
			this.manager.itemEnd(e);
		}), this.manager.itemStart(e);
	}
	setResponseType(e) {
		return this.responseType = e, this;
	}
	setMimeType(e) {
		return this.mimeType = e, this;
	}
	abort() {
		return this._abortController.abort(), this._abortController = new AbortController(), this;
	}
}, Jo = /* @__PURE__ */ new WeakMap(), Yo = class extends Wo {
	constructor(e) {
		super(e);
	}
	load(e, t, n, r) {
		this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
		let i = this, a = Vo.get(`image:${e}`);
		if (a !== void 0) {
			if (a.complete === !0) i.manager.itemStart(e), setTimeout(function() {
				t && t(a), i.manager.itemEnd(e);
			}, 0);
			else {
				let e = Jo.get(a);
				e === void 0 && (e = [], Jo.set(a, e)), e.push({
					onLoad: t,
					onError: r
				});
			}
			return a;
		}
		let o = Ye("img");
		function s() {
			l(), t && t(this);
			let n = Jo.get(this) || [];
			for (let e = 0; e < n.length; e++) {
				let t = n[e];
				t.onLoad && t.onLoad(this);
			}
			Jo.delete(this), i.manager.itemEnd(e);
		}
		function c(t) {
			l(), r && r(t), Vo.remove(`image:${e}`);
			let n = Jo.get(this) || [];
			for (let e = 0; e < n.length; e++) {
				let r = n[e];
				r.onError && r.onError(t);
			}
			Jo.delete(this), i.manager.itemError(e), i.manager.itemEnd(e);
		}
		function l() {
			o.removeEventListener("load", s, !1), o.removeEventListener("error", c, !1);
		}
		return o.addEventListener("load", s, !1), o.addEventListener("error", c, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), Vo.add(`image:${e}`, o), i.manager.itemStart(e), o.src = e, o;
	}
}, Xo = class extends Wo {
	constructor(e) {
		super(e);
	}
	load(e, t, n, r) {
		let i = new Kt(), a = new Yo(this.manager);
		return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(e) {
			i.image = e, i.needsUpdate = !0, t !== void 0 && t(i);
		}, n, r), i;
	}
}, Zo = class extends Tn {
	constructor(e, t = 1) {
		super(), this.isLight = !0, this.type = "Light", this.color = new J(e), this.intensity = t;
	}
	copy(e, t) {
		return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, t;
	}
}, Qo = class extends Zo {
	constructor(e, t, n) {
		super(e, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(Tn.DEFAULT_UP), this.updateMatrix(), this.groundColor = new J(t);
	}
	copy(e, t) {
		return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.groundColor = this.groundColor.getHex(), t;
	}
}, $o = /*@__PURE__*/ new q(), es = /*@__PURE__*/ new W(), ts = /*@__PURE__*/ new W(), ns = class {
	constructor(e) {
		this.camera = e, this.intensity = 1, this.bias = 0, this.biasNode = null, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new U(512, 512), this.mapType = f, this.map = null, this.mapPass = null, this.matrix = new q(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new ji(), this._frameExtents = new U(1, 1), this._viewportCount = 1, this._viewports = [new qt(0, 0, 1, 1)];
	}
	getViewportCount() {
		return this._viewportCount;
	}
	getCamera() {
		return this.camera;
	}
	getFrustum() {
		return this._frustum;
	}
	updateMatrices(e) {
		let t = this.camera;
		es.setFromMatrixPosition(e.matrixWorld), t.position.copy(es), ts.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(ts), t.updateMatrixWorld(), this._updateMatrix(t, this.matrix, this._frustum);
	}
	_updateMatrix(e, t, n, r) {
		$o.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), n.setFromProjectionMatrix($o, e.coordinateSystem, e.reversedDepth);
		let i = this._frameExtents, a = r ? r.z / i.x : 1, o = r ? r.w / i.y : 1, s = r ? r.x / i.x : 0, c = r ? r.y / i.y : 0;
		e.coordinateSystem === 2001 || e.reversedDepth ? t.set(.5 * a, 0, 0, .5 * a + s, 0, .5 * o, 0, .5 * o + c, 0, 0, 1, 0, 0, 0, 0, 1) : t.set(.5 * a, 0, 0, .5 * a + s, 0, .5 * o, 0, .5 * o + c, 0, 0, .5, .5, 0, 0, 0, 1), t.multiply($o);
	}
	getViewport(e) {
		return this._viewports[e];
	}
	getFrameExtents() {
		return this._frameExtents;
	}
	dispose() {
		this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
	}
	copy(e) {
		return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this.biasNode = e.biasNode, this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	toJSON() {
		let e = {};
		return e.intensity = this.intensity, e.bias = this.bias, e.normalBias = this.normalBias, e.radius = this.radius, e.blurSamples = this.blurSamples, e.mapSize = this.mapSize.toArray(), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
	}
}, rs = /*@__PURE__*/ new W(), is = /*@__PURE__*/ new At(), as = /*@__PURE__*/ new W(), os = class extends Tn {
	constructor() {
		super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new q(), this.projectionMatrix = new q(), this.projectionMatrixInverse = new q(), this.coordinateSystem = Ke, this._reversedDepth = !1;
	}
	get reversedDepth() {
		return this._reversedDepth;
	}
	copy(e, t) {
		return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
	}
	getWorldDirection(e) {
		return super.getWorldDirection(e).negate();
	}
	updateMatrixWorld(e) {
		super.updateMatrixWorld(e), this.matrixWorld.decompose(rs, is, as), as.x === 1 && as.y === 1 && as.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(rs, is, as.set(1, 1, 1)).invert();
	}
	updateWorldMatrix(e, t, n = !1) {
		super.updateWorldMatrix(e, t, n), this.matrixWorld.decompose(rs, is, as), as.x === 1 && as.y === 1 && as.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(rs, is, as.set(1, 1, 1)).invert();
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, ss = /*@__PURE__*/ new W(), cs = /*@__PURE__*/ new U(), ls = /*@__PURE__*/ new U(), us = class extends os {
	constructor(e = 50, t = 1, n = .1, r = 2e3) {
		super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = r, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
	}
	copy(e, t) {
		return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
	}
	setFocalLength(e) {
		let t = .5 * this.getFilmHeight() / e;
		this.fov = st * 2 * Math.atan(t), this.updateProjectionMatrix();
	}
	getFocalLength() {
		let e = Math.tan(ot * .5 * this.fov);
		return .5 * this.getFilmHeight() / e;
	}
	getEffectiveFOV() {
		return st * 2 * Math.atan(Math.tan(ot * .5 * this.fov) / this.zoom);
	}
	getFilmWidth() {
		return this.filmGauge * Math.min(this.aspect, 1);
	}
	getFilmHeight() {
		return this.filmGauge / Math.max(this.aspect, 1);
	}
	getViewBounds(e, t, n) {
		ss.set(-1, -1, .5).applyMatrix4(this.projectionMatrixInverse), t.set(ss.x, ss.y).multiplyScalar(-e / ss.z), ss.set(1, 1, .5).applyMatrix4(this.projectionMatrixInverse), n.set(ss.x, ss.y).multiplyScalar(-e / ss.z);
	}
	getViewSize(e, t) {
		return this.getViewBounds(e, cs, ls), t.subVectors(ls, cs);
	}
	setViewOffset(e, t, n, r, i, a) {
		this.aspect = e / t, this.view === null && (this.view = {
			enabled: !0,
			fullWidth: 1,
			fullHeight: 1,
			offsetX: 0,
			offsetY: 0,
			width: 1,
			height: 1
		}), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = a, this.updateProjectionMatrix();
	}
	clearViewOffset() {
		this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
	}
	updateProjectionMatrix() {
		let e = this.near, t = e * Math.tan(ot * .5 * this.fov) / this.zoom, n = 2 * t, r = this.aspect * n, i = -.5 * r, a = this.view;
		if (this.view !== null && this.view.enabled) {
			let e = a.fullWidth, o = a.fullHeight;
			i += a.offsetX * r / e, t -= a.offsetY * n / o, r *= a.width / e, n *= a.height / o;
		}
		let o = this.filmOffset;
		o !== 0 && (i += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(i, i + r, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
	}
}, ds = class extends ns {
	constructor() {
		super(new us(50, 1, .5, 500)), this.isSpotLightShadow = !0, this.focus = 1, this.aspect = 1;
	}
	updateMatrices(e) {
		let t = this.camera, n = st * 2 * e.angle * this.focus, r = this.mapSize.width / this.mapSize.height * this.aspect, i = e.distance || t.far;
		(n !== t.fov || r !== t.aspect || i !== t.far) && (t.fov = n, t.aspect = r, t.far = i, t.updateProjectionMatrix()), super.updateMatrices(e);
	}
	copy(e) {
		return super.copy(e), this.focus = e.focus, this.aspect = e.aspect, this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.focus = this.focus, e.aspect = this.aspect, e;
	}
}, fs = class extends Zo {
	constructor(e, t, n = 0, r = Math.PI / 3, i = 0, a = 2) {
		super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(Tn.DEFAULT_UP), this.updateMatrix(), this.target = new Tn(), this.distance = n, this.angle = r, this.penumbra = i, this.decay = a, this.map = null, this.shadow = new ds();
	}
	get power() {
		return this.intensity * Math.PI;
	}
	set power(e) {
		this.intensity = e / Math.PI;
	}
	dispose() {
		super.dispose(), this.shadow.dispose();
	}
	copy(e, t) {
		return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.map = e.map, this.shadow = e.shadow.clone(), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.distance = this.distance, t.object.angle = this.angle, t.object.decay = this.decay, t.object.penumbra = this.penumbra, t.object.target = this.target.uuid, this.map && this.map.isTexture && (t.object.map = this.map.toJSON(e).uuid), t.object.shadow = this.shadow.toJSON(), t;
	}
}, ps = class extends ns {
	constructor() {
		super(new us(90, 1, .5, 500)), this.isPointLightShadow = !0;
	}
}, ms = class extends Zo {
	constructor(e, t, n = 0, r = 2) {
		super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = r, this.shadow = new ps();
	}
	get power() {
		return this.intensity * 4 * Math.PI;
	}
	set power(e) {
		this.intensity = e / (4 * Math.PI);
	}
	dispose() {
		super.dispose(), this.shadow.dispose();
	}
	copy(e, t) {
		return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.distance = this.distance, t.object.decay = this.decay, t.object.shadow = this.shadow.toJSON(), t;
	}
}, hs = class extends os {
	constructor(e = -1, t = 1, n = 1, r = -1, i = .1, a = 2e3) {
		super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = r, this.near = i, this.far = a, this.updateProjectionMatrix();
	}
	copy(e, t) {
		return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
	}
	setViewOffset(e, t, n, r, i, a) {
		this.view === null && (this.view = {
			enabled: !0,
			fullWidth: 1,
			fullHeight: 1,
			offsetX: 0,
			offsetY: 0,
			width: 1,
			height: 1
		}), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = a, this.updateProjectionMatrix();
	}
	clearViewOffset() {
		this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
	}
	updateProjectionMatrix() {
		let e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2, i = n - e, a = n + e, o = r + t, s = r - t;
		if (this.view !== null && this.view.enabled) {
			let e = (this.right - this.left) / this.view.fullWidth / this.zoom, t = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
			i += e * this.view.offsetX, a = i + e * this.view.width, o -= t * this.view.offsetY, s = o - t * this.view.height;
		}
		this.projectionMatrix.makeOrthographic(i, a, o, s, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
	}
}, gs = class extends ns {
	constructor() {
		super(new hs(-5, 5, 5, -5, .5, 500)), this.isDirectionalLightShadow = !0;
	}
}, _s = class extends Zo {
	constructor(e, t) {
		super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(Tn.DEFAULT_UP), this.updateMatrix(), this.target = new Tn(), this.shadow = new gs();
	}
	dispose() {
		super.dispose(), this.shadow.dispose();
	}
	copy(e) {
		return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.shadow = this.shadow.toJSON(), t.object.target = this.target.uuid, t;
	}
}, vs = class {
	static extractUrlBase(e) {
		let t = e.lastIndexOf("/");
		return t === -1 ? "./" : e.slice(0, t + 1);
	}
	static resolveURL(e, t) {
		return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
	}
}, ys = /* @__PURE__ */ new WeakMap(), bs = class extends Wo {
	constructor(e) {
		super(e), this.isImageBitmapLoader = !0, typeof createImageBitmap > "u" && B("ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && B("ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" }, this._abortController = new AbortController();
	}
	setOptions(e) {
		return this.options = e, this;
	}
	load(e, t, n, r) {
		e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
		let i = this, a = Vo.get(`image-bitmap:${e}`);
		if (a !== void 0) {
			if (i.manager.itemStart(e), a.then) {
				a.then((n) => {
					ys.has(a) === !0 ? (r && r(ys.get(a)), i.manager.itemError(e), i.manager.itemEnd(e)) : (t && t(n), i.manager.itemEnd(e));
				});
				return;
			}
			setTimeout(function() {
				t && t(a), i.manager.itemEnd(e);
			}, 0);
			return;
		}
		let o = {};
		o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader, o.signal = typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal;
		let s = fetch(e, o).then(function(e) {
			return e.blob();
		}).then(function(e) {
			return createImageBitmap(e, Object.assign({}, i.options, { colorSpaceConversion: "none" }));
		}).then(function(n) {
			return Vo.add(`image-bitmap:${e}`, n), t && t(n), i.manager.itemEnd(e), n;
		}).catch(function(t) {
			r && r(t), ys.set(s, t), Vo.remove(`image-bitmap:${e}`), i.manager.itemError(e), i.manager.itemEnd(e);
		});
		Vo.add(`image-bitmap:${e}`, s), i.manager.itemStart(e);
	}
	abort() {
		return this._abortController.abort(), this._abortController = new AbortController(), this;
	}
}, xs = -90, Ss = 1, Cs = class extends Tn {
	constructor(e, t, n) {
		super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
		let r = new us(xs, Ss, e, t);
		r.layers = this.layers, this.add(r);
		let i = new us(xs, Ss, e, t);
		i.layers = this.layers, this.add(i);
		let a = new us(xs, Ss, e, t);
		a.layers = this.layers, this.add(a);
		let o = new us(xs, Ss, e, t);
		o.layers = this.layers, this.add(o);
		let s = new us(xs, Ss, e, t);
		s.layers = this.layers, this.add(s);
		let c = new us(xs, Ss, e, t);
		c.layers = this.layers, this.add(c);
	}
	updateCoordinateSystem() {
		let e = this.coordinateSystem, t = this.children.concat(), [n, r, i, a, o, s] = t;
		for (let e of t) this.remove(e);
		if (e === 2e3) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), i.up.set(0, 0, -1), i.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), s.up.set(0, 1, 0), s.lookAt(0, 0, -1);
		else if (e === 2001) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), i.up.set(0, 0, 1), i.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), s.up.set(0, -1, 0), s.lookAt(0, 0, -1);
		else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
		for (let e of t) this.add(e), e.updateMatrixWorld();
	}
	update(e, t) {
		this.parent === null && this.updateMatrixWorld();
		let { renderTarget: n, activeMipmapLevel: r } = this;
		this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
		let [i, a, o, s, c, l] = this.children, u = e.getRenderTarget(), d = e.getActiveCubeFace(), f = e.getActiveMipmapLevel(), p = e.xr.enabled;
		e.xr.enabled = !1;
		let m = n.texture.generateMipmaps;
		n.texture.generateMipmaps = !1;
		let h = !1;
		h = e.isWebGLRenderer === !0 ? e.state.buffers.depth.getReversed() : e.reversedDepthBuffer, e.setRenderTarget(n, 0, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, i), e.setRenderTarget(n, 1, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, a), e.setRenderTarget(n, 2, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, o), e.setRenderTarget(n, 3, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, s), e.setRenderTarget(n, 4, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, c), n.texture.generateMipmaps = m, e.setRenderTarget(n, 5, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, l), e.setRenderTarget(u, d, f), e.xr.enabled = p, n.texture.needsPMREMUpdate = !0;
	}
}, ws = class extends us {
	constructor(e = []) {
		super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = e;
	}
}, Ts = "\\[\\]\\.:\\/", Es = /* @__PURE__ */ RegExp("[\\[\\]\\.:\\/]", "g"), Ds = "[^\\[\\]\\.:\\/]", Os = "[^" + Ts.replace("\\.", "") + "]", ks = /*@__PURE__*/ "((?:WC+[\\/:])*)".replace("WC", Ds), As = /*@__PURE__*/ "(WCOD+)?".replace("WCOD", Os), js = /*@__PURE__*/ "(?:\\.(WC+)(?:\\[(.+)\\])?)?".replace("WC", Ds), Ms = /*@__PURE__*/ "\\.(WC+)(?:\\[(.+)\\])?".replace("WC", Ds), Ns = RegExp("^" + ks + As + js + Ms + "$"), Ps = [
	"material",
	"materials",
	"bones",
	"map"
], Fs = class {
	constructor(e, t, n) {
		let r = n || Is.parseTrackName(t);
		this._targetGroup = e, this._bindings = e.subscribe_(t, r);
	}
	getValue(e, t) {
		this.bind();
		let n = this._targetGroup.nCachedObjects_, r = this._bindings[n];
		r !== void 0 && r.getValue(e, t);
	}
	setValue(e, t) {
		let n = this._bindings;
		for (let r = this._targetGroup.nCachedObjects_, i = n.length; r !== i; ++r) n[r].setValue(e, t);
	}
	bind() {
		let e = this._bindings;
		for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind();
	}
	unbind() {
		let e = this._bindings;
		for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind();
	}
}, Is = class e {
	constructor(t, n, r) {
		this.path = n, this.parsedPath = r || e.parseTrackName(n), this.node = e.findNode(t, this.parsedPath.nodeName), this.rootNode = t, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
	}
	static create(t, n, r) {
		return t && t.isAnimationObjectGroup ? new e.Composite(t, n, r) : new e(t, n, r);
	}
	static sanitizeNodeName(e) {
		return e.replace(/\s/g, "_").replace(Es, "");
	}
	static parseTrackName(e) {
		let t = Ns.exec(e);
		if (t === null) throw Error("THREE.PropertyBinding: Cannot parse trackName: " + e);
		let n = {
			nodeName: t[2],
			objectName: t[3],
			objectIndex: t[4],
			propertyName: t[5],
			propertyIndex: t[6]
		}, r = n.nodeName && n.nodeName.lastIndexOf(".");
		if (r !== void 0 && r !== -1) {
			let e = n.nodeName.substring(r + 1);
			Ps.indexOf(e) !== -1 && (n.nodeName = n.nodeName.substring(0, r), n.objectName = e);
		}
		if (n.propertyName === null || n.propertyName.length === 0) throw Error("THREE.PropertyBinding: can not parse propertyName from trackName: " + e);
		return n;
	}
	static findNode(e, t) {
		if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid) return e;
		if (e.skeleton) {
			let n = e.skeleton.getBoneByName(t);
			if (n !== void 0) return n;
		}
		if (e.children) {
			let n = function(e) {
				for (let r = 0; r < e.length; r++) {
					let i = e[r];
					if (i.name === t || i.uuid === t) return i;
					let a = n(i.children);
					if (a) return a;
				}
				return null;
			}, r = n(e.children);
			if (r) return r;
		}
		return null;
	}
	_getValue_unavailable() {}
	_setValue_unavailable() {}
	_getValue_direct(e, t) {
		e[t] = this.targetObject[this.propertyName];
	}
	_getValue_array(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) e[t++] = n[r];
	}
	_getValue_arrayElement(e, t) {
		e[t] = this.resolvedProperty[this.propertyIndex];
	}
	_getValue_toArray(e, t) {
		this.resolvedProperty.toArray(e, t);
	}
	_setValue_direct(e, t) {
		this.targetObject[this.propertyName] = e[t];
	}
	_setValue_direct_setNeedsUpdate(e, t) {
		this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = !0;
	}
	_setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
		this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_setValue_array(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
	}
	_setValue_array_setNeedsUpdate(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
		this.targetObject.needsUpdate = !0;
	}
	_setValue_array_setMatrixWorldNeedsUpdate(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
		this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_setValue_arrayElement(e, t) {
		this.resolvedProperty[this.propertyIndex] = e[t];
	}
	_setValue_arrayElement_setNeedsUpdate(e, t) {
		this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = !0;
	}
	_setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
		this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_setValue_fromArray(e, t) {
		this.resolvedProperty.fromArray(e, t);
	}
	_setValue_fromArray_setNeedsUpdate(e, t) {
		this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = !0;
	}
	_setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
		this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_getValue_unbound(e, t) {
		this.bind(), this.getValue(e, t);
	}
	_setValue_unbound(e, t) {
		this.bind(), this.setValue(e, t);
	}
	bind() {
		let t = this.node, n = this.parsedPath, r = n.objectName, i = n.propertyName, a = n.propertyIndex;
		if (t || (t = e.findNode(this.rootNode, n.nodeName), this.node = t), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t) {
			B("PropertyBinding: No target node found for track: " + this.path + ".");
			return;
		}
		if (r) {
			let e = n.objectIndex;
			switch (r) {
				case "materials":
					if (!t.material) {
						V("PropertyBinding: Can not bind to material as node does not have a material.", this);
						return;
					}
					if (!t.material.materials) {
						V("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
						return;
					}
					t = t.material.materials;
					break;
				case "bones":
					if (!t.skeleton) {
						V("PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
						return;
					}
					t = t.skeleton.bones;
					for (let n = 0; n < t.length; n++) if (t[n].name === e) {
						e = n;
						break;
					}
					break;
				case "map":
					if ("map" in t) {
						t = t.map;
						break;
					}
					if (!t.material) {
						V("PropertyBinding: Can not bind to material as node does not have a material.", this);
						return;
					}
					if (!t.material.map) {
						V("PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
						return;
					}
					t = t.material.map;
					break;
				default:
					if (t[r] === void 0) {
						V("PropertyBinding: Can not bind to objectName of node undefined.", this);
						return;
					}
					t = t[r];
			}
			if (e !== void 0) {
				if (t[e] === void 0) {
					V("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, t);
					return;
				}
				t = t[e];
			}
		}
		let o = t[i];
		if (o === void 0) {
			let e = n.nodeName;
			V("PropertyBinding: Trying to update property for track: " + e + "." + i + " but it wasn't found.", t);
			return;
		}
		let s = this.Versioning.None;
		this.targetObject = t, t.isMaterial === !0 ? s = this.Versioning.NeedsUpdate : t.isObject3D === !0 && (s = this.Versioning.MatrixWorldNeedsUpdate);
		let c = this.BindingType.Direct;
		if (a !== void 0) {
			if (i === "morphTargetInfluences") {
				if (!t.geometry) {
					V("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
					return;
				}
				if (!t.geometry.morphAttributes) {
					V("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
					return;
				}
				t.morphTargetDictionary[a] !== void 0 && (a = t.morphTargetDictionary[a]);
			}
			c = this.BindingType.ArrayElement, this.resolvedProperty = o, this.propertyIndex = a;
		} else o.fromArray !== void 0 && o.toArray !== void 0 ? (c = this.BindingType.HasFromToArray, this.resolvedProperty = o) : Array.isArray(o) ? (c = this.BindingType.EntireArray, this.resolvedProperty = o) : this.propertyName = i;
		this.getValue = this.GetterByBindingType[c], this.setValue = this.SetterByBindingTypeAndVersioning[c][s];
	}
	unbind() {
		this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
	}
};
Is.Composite = Fs, Is.prototype.BindingType = {
	Direct: 0,
	EntireArray: 1,
	ArrayElement: 2,
	HasFromToArray: 3
}, Is.prototype.Versioning = {
	None: 0,
	NeedsUpdate: 1,
	MatrixWorldNeedsUpdate: 2
}, Is.prototype.GetterByBindingType = [
	Is.prototype._getValue_direct,
	Is.prototype._getValue_array,
	Is.prototype._getValue_arrayElement,
	Is.prototype._getValue_toArray
], Is.prototype.SetterByBindingTypeAndVersioning = [
	[
		Is.prototype._setValue_direct,
		Is.prototype._setValue_direct_setNeedsUpdate,
		Is.prototype._setValue_direct_setMatrixWorldNeedsUpdate
	],
	[
		Is.prototype._setValue_array,
		Is.prototype._setValue_array_setNeedsUpdate,
		Is.prototype._setValue_array_setMatrixWorldNeedsUpdate
	],
	[
		Is.prototype._setValue_arrayElement,
		Is.prototype._setValue_arrayElement_setNeedsUpdate,
		Is.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
	],
	[
		Is.prototype._setValue_fromArray,
		Is.prototype._setValue_fromArray_setNeedsUpdate,
		Is.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
	]
];
var Ls = /*@__PURE__*/ new q(), Rs = class {
	constructor(e, t, n = 0, r = Infinity) {
		this.ray = new Hr(e, t), this.near = n, this.far = r, this.camera = null, this.layers = new ln(), this.params = {
			Mesh: {},
			Line: { threshold: 1 },
			LOD: {},
			Points: { threshold: 1 },
			Sprite: {}
		};
	}
	set(e, t) {
		this.ray.set(e, t);
	}
	setFromCamera(e, t) {
		t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, .5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, t.projectionMatrix.elements[14]).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : V("Raycaster: Unsupported camera type: " + t.type);
	}
	setFromXRController(e) {
		return Ls.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(Ls), this;
	}
	intersectObject(e, t = !0, n = []) {
		return Bs(e, this, n, t), n.sort(zs), n;
	}
	intersectObjects(e, t = !0, n = []) {
		for (let r = 0, i = e.length; r < i; r++) Bs(e[r], this, n, t);
		return n.sort(zs), n;
	}
};
function zs(e, t) {
	return e.distance - t.distance;
}
function Bs(e, t, n, r) {
	let i = !0;
	if (e.layers.test(t.layers) && e.raycast(t, n) === !1 && (i = !1), i === !0 && r === !0) {
		let r = e.children;
		for (let e = 0, i = r.length; e < i; e++) Bs(r[e], t, n, !0);
	}
}
var Vs = class {
	constructor(e = 1, t = 0, n = 0) {
		this.radius = e, this.phi = t, this.theta = n;
	}
	set(e, t, n) {
		return this.radius = e, this.phi = t, this.theta = n, this;
	}
	copy(e) {
		return this.radius = e.radius, this.phi = e.phi, this.theta = e.theta, this;
	}
	makeSafe() {
		let e = 1e-6;
		return this.phi = H(this.phi, e, Math.PI - e), this;
	}
	setFromVector3(e) {
		return this.setFromCartesianCoords(e.x, e.y, e.z);
	}
	setFromCartesianCoords(e, t, n) {
		return this.radius = Math.sqrt(e * e + t * t + n * n), this.radius === 0 ? (this.theta = 0, this.phi = 0) : (this.theta = Math.atan2(e, n), this.phi = Math.acos(H(t / this.radius, -1, 1))), this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
};
(class e {
	static {
		e.prototype.isMatrix2 = !0;
	}
	constructor(e, t, n, r) {
		this.elements = [
			1,
			0,
			0,
			1
		], e !== void 0 && this.set(e, t, n, r);
	}
	identity() {
		return this.set(1, 0, 0, 1), this;
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < 4; n++) this.elements[n] = e[n + t];
		return this;
	}
	set(e, t, n, r) {
		let i = this.elements;
		return i[0] = e, i[2] = t, i[1] = n, i[3] = r, this;
	}
});
var Hs = /*@__PURE__*/ new W(), Us = /*@__PURE__*/ new W(), Ws = /*@__PURE__*/ new W(), Gs = /*@__PURE__*/ new W(), Ks = /*@__PURE__*/ new W(), qs = /*@__PURE__*/ new W(), Js = /*@__PURE__*/ new W(), Ys = class {
	constructor(e = new W(), t = new W()) {
		this.start = e, this.end = t;
	}
	set(e, t) {
		return this.start.copy(e), this.end.copy(t), this;
	}
	copy(e) {
		return this.start.copy(e.start), this.end.copy(e.end), this;
	}
	getCenter(e) {
		return e.addVectors(this.start, this.end).multiplyScalar(.5);
	}
	delta(e) {
		return e.subVectors(this.end, this.start);
	}
	distanceSq() {
		return this.start.distanceToSquared(this.end);
	}
	distance() {
		return this.start.distanceTo(this.end);
	}
	at(e, t) {
		return this.delta(t).multiplyScalar(e).add(this.start);
	}
	closestPointToPointParameter(e, t) {
		Hs.subVectors(e, this.start), Us.subVectors(this.end, this.start);
		let n = Us.dot(Us);
		if (n === 0) return 0;
		let r = Us.dot(Hs) / n;
		return t && (r = H(r, 0, 1)), r;
	}
	closestPointToPoint(e, t, n) {
		let r = this.closestPointToPointParameter(e, t);
		return this.delta(n).multiplyScalar(r).add(this.start);
	}
	distanceSqToLine3(e, t = qs, n = Js) {
		let r = 1e-8 * 1e-8, i, a, o = this.start, s = e.start, c = this.end, l = e.end;
		Ws.subVectors(c, o), Gs.subVectors(l, s), Ks.subVectors(o, s);
		let u = Ws.dot(Ws), d = Gs.dot(Gs), f = Gs.dot(Ks);
		if (u <= r && d <= r) return t.copy(o), n.copy(s), t.sub(n), t.dot(t);
		if (u <= r) i = 0, a = f / d, a = H(a, 0, 1);
		else {
			let e = Ws.dot(Ks);
			if (d <= r) a = 0, i = H(-e / u, 0, 1);
			else {
				let t = Ws.dot(Gs), n = u * d - t * t;
				i = n === 0 ? 0 : H((t * f - e * d) / n, 0, 1), a = (t * i + f) / d, a < 0 ? (a = 0, i = H(-e / u, 0, 1)) : a > 1 && (a = 1, i = H((t - e) / u, 0, 1));
			}
		}
		return t.copy(o).addScaledVector(Ws, i), n.copy(s).addScaledVector(Gs, a), t.distanceToSquared(n);
	}
	applyMatrix4(e) {
		return this.start.applyMatrix4(e), this.end.applyMatrix4(e), this;
	}
	equals(e) {
		return e.start.equals(this.start) && e.end.equals(this.end);
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, Xs = class extends rt {
	constructor(e, t = null) {
		super(), this.object = e, this.domElement = t, this.enabled = !0, this.state = -1, this.keys = {}, this.mouseButtons = {
			LEFT: null,
			MIDDLE: null,
			RIGHT: null
		}, this.touches = {
			ONE: null,
			TWO: null
		};
	}
	connect(e) {
		this.domElement !== null && this.disconnect(), this.domElement = e;
	}
	disconnect() {}
	dispose() {}
	update() {}
};
function Zs(e, t, n, r) {
	let i = Qs(r);
	switch (n) {
		case T: return e * t;
		case A: return e * t / i.components * i.byteLength;
		case j: return e * t / i.components * i.byteLength;
		case ee: return e * t * 2 / i.components * i.byteLength;
		case te: return e * t * 2 / i.components * i.byteLength;
		case E: return e * t * 3 / i.components * i.byteLength;
		case D: return e * t * 4 / i.components * i.byteLength;
		case M: return e * t * 4 / i.components * i.byteLength;
		case ne:
		case N: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
		case re:
		case P: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case ae:
		case se: return Math.max(e, 16) * Math.max(t, 8) / 4;
		case ie:
		case oe: return Math.max(e, 8) * Math.max(t, 8) / 2;
		case ce:
		case F:
		case ue:
		case de: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
		case le:
		case fe:
		case pe: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case me: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case he: return Math.floor((e + 4) / 5) * Math.floor((t + 3) / 4) * 16;
		case ge: return Math.floor((e + 4) / 5) * Math.floor((t + 4) / 5) * 16;
		case _e: return Math.floor((e + 5) / 6) * Math.floor((t + 4) / 5) * 16;
		case ve: return Math.floor((e + 5) / 6) * Math.floor((t + 5) / 6) * 16;
		case ye: return Math.floor((e + 7) / 8) * Math.floor((t + 4) / 5) * 16;
		case be: return Math.floor((e + 7) / 8) * Math.floor((t + 5) / 6) * 16;
		case xe: return Math.floor((e + 7) / 8) * Math.floor((t + 7) / 8) * 16;
		case Se: return Math.floor((e + 9) / 10) * Math.floor((t + 4) / 5) * 16;
		case Ce: return Math.floor((e + 9) / 10) * Math.floor((t + 5) / 6) * 16;
		case we: return Math.floor((e + 9) / 10) * Math.floor((t + 7) / 8) * 16;
		case Te: return Math.floor((e + 9) / 10) * Math.floor((t + 9) / 10) * 16;
		case Ee: return Math.floor((e + 11) / 12) * Math.floor((t + 9) / 10) * 16;
		case De: return Math.floor((e + 11) / 12) * Math.floor((t + 11) / 12) * 16;
		case Oe:
		case ke:
		case Ae: return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
		case je:
		case Me: return Math.ceil(e / 4) * Math.ceil(t / 4) * 8;
		case I:
		case Ne: return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
	}
	throw Error(`Unable to determine texture byte length for ${n} format.`);
}
function Qs(e) {
	switch (e) {
		case f:
		case p: return {
			byteLength: 1,
			components: 1
		};
		case h:
		case m:
		case y: return {
			byteLength: 2,
			components: 1
		};
		case b:
		case x: return {
			byteLength: 2,
			components: 4
		};
		case _:
		case g:
		case v: return {
			byteLength: 4,
			components: 1
		};
		case C:
		case w: return {
			byteLength: 4,
			components: 3
		};
	}
	throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: "186" } })), typeof window < "u" && (window.__THREE__ ? B("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = "186");
// node_modules/three/build/three.module.js
function $s() {
	let e = null, t = !1, n = null, r = null;
	function i(t, a) {
		r = e.requestAnimationFrame(i), n(t, a);
	}
	return {
		start: function() {
			t !== !0 && n !== null && e !== null && (r = e.requestAnimationFrame(i), t = !0);
		},
		stop: function() {
			e !== null && e.cancelAnimationFrame(r), t = !1;
		},
		setAnimationLoop: function(e) {
			n = e;
		},
		setContext: function(t) {
			e = t;
		}
	};
}
function ec(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(t, n) {
		let r = t.array, i = t.usage, a = r.byteLength, o = e.createBuffer();
		e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback();
		let s;
		if (r instanceof Float32Array) s = e.FLOAT;
		else if (typeof Float16Array < "u" && r instanceof Float16Array) s = e.HALF_FLOAT;
		else if (r instanceof Uint16Array) s = t.isFloat16BufferAttribute ? e.HALF_FLOAT : e.UNSIGNED_SHORT;
		else if (r instanceof Int16Array) s = e.SHORT;
		else if (r instanceof Uint32Array) s = e.UNSIGNED_INT;
		else if (r instanceof Int32Array) s = e.INT;
		else if (r instanceof Int8Array) s = e.BYTE;
		else if (r instanceof Uint8Array) s = e.UNSIGNED_BYTE;
		else if (r instanceof Uint8ClampedArray) s = e.UNSIGNED_BYTE;
		else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: " + r);
		return {
			buffer: o,
			type: s,
			bytesPerElement: r.BYTES_PER_ELEMENT,
			version: t.version,
			size: a
		};
	}
	function r(t, n, r) {
		let i = n.array, a = n.updateRanges;
		if (e.bindBuffer(r, t), a.length === 0) e.bufferSubData(r, 0, i);
		else {
			a.sort((e, t) => e.start - t.start);
			let t = 0;
			for (let e = 1; e < a.length; e++) {
				let n = a[t], r = a[e];
				r.start <= n.start + n.count + 1 ? n.count = Math.max(n.count, r.start + r.count - n.start) : (++t, a[t] = r);
			}
			a.length = t + 1;
			for (let t = 0, n = a.length; t < n; t++) {
				let n = a[t];
				e.bufferSubData(r, n.start * i.BYTES_PER_ELEMENT, i, n.start, n.count);
			}
			n.clearUpdateRanges();
		}
		n.onUploadCallback();
	}
	function i(e) {
		return e.isInterleavedBufferAttribute && (e = e.data), t.get(e);
	}
	function a(n) {
		n.isInterleavedBufferAttribute && (n = n.data);
		let r = t.get(n);
		r && (e.deleteBuffer(r.buffer), t.delete(n));
	}
	function o(e, i) {
		if (e.isInterleavedBufferAttribute && (e = e.data), e.isGLBufferAttribute) {
			let n = t.get(e);
			(!n || n.version < e.version) && t.set(e, {
				buffer: e.buffer,
				type: e.type,
				bytesPerElement: e.elementSize,
				version: e.version
			});
			return;
		}
		let a = t.get(e);
		if (a === void 0) t.set(e, n(e, i));
		else if (a.version < e.version) {
			if (a.size !== e.array.byteLength) throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
			r(a.buffer, e, i), a.version = e.version;
		}
	}
	return {
		get: i,
		remove: a,
		update: o
	};
}
var Y = {
	alphahash_fragment: "#ifdef USE_ALPHAHASH\n	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif",
	alphahash_pars_fragment: "#ifdef USE_ALPHAHASH\n	const float ALPHA_HASH_SCALE = 0.05;\n	float hash2D( vec2 value ) {\n		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n	}\n	float hash3D( vec3 value ) {\n		return hash2D( vec2( hash2D( value.xy ), value.z ) );\n	}\n	float getAlphaHashThreshold( vec3 position ) {\n		float maxDeriv = max(\n			length( dFdx( position.xyz ) ),\n			length( dFdy( position.xyz ) )\n		);\n		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n		vec2 pixScales = vec2(\n			exp2( floor( log2( pixScale ) ) ),\n			exp2( ceil( log2( pixScale ) ) )\n		);\n		vec2 alpha = vec2(\n			hash3D( floor( pixScales.x * position.xyz ) ),\n			hash3D( floor( pixScales.y * position.xyz ) )\n		);\n		float lerpFactor = fract( log2( pixScale ) );\n		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n		float a = min( lerpFactor, 1.0 - lerpFactor );\n		vec3 cases = vec3(\n			x * x / ( 2.0 * a * ( 1.0 - a ) ),\n			( x - 0.5 * a ) / ( 1.0 - a ),\n			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n		);\n		float threshold = ( x < ( 1.0 - a ) )\n			? ( ( x < a ) ? cases.x : cases.y )\n			: cases.z;\n		return clamp( threshold , 1.0e-6, 1.0 );\n	}\n#endif",
	alphamap_fragment: "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif",
	alphamap_pars_fragment: "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	alphatest_fragment: "#ifdef USE_ALPHATEST\n	#ifdef ALPHA_TO_COVERAGE\n	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );\n	if ( diffuseColor.a == 0.0 ) discard;\n	#else\n	if ( diffuseColor.a < alphaTest ) discard;\n	#endif\n#endif",
	alphatest_pars_fragment: "#ifdef USE_ALPHATEST\n	uniform float alphaTest;\n#endif",
	aomap_fragment: "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_CLEARCOAT ) \n		clearcoatSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_SHEEN ) \n		sheenSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD )\n		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n	#endif\n#endif",
	aomap_pars_fragment: "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif",
	batching_pars_vertex: "#ifdef USE_BATCHING\n	#if ! defined( GL_ANGLE_multi_draw )\n	#define gl_DrawID _gl_DrawID\n	uniform int _gl_DrawID;\n	#endif\n	uniform highp sampler2D batchingTexture;\n	uniform highp usampler2D batchingIdTexture;\n	mat4 getBatchingMatrix( const in float i ) {\n		int size = textureSize( batchingTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n	float getIndirectIndex( const in int i ) {\n		int size = textureSize( batchingIdTexture, 0 ).x;\n		int x = i % size;\n		int y = i / size;\n		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );\n	}\n#endif\n#ifdef USE_BATCHING_COLOR\n	uniform sampler2D batchingColorTexture;\n	vec4 getBatchingColor( const in float i ) {\n		int size = textureSize( batchingColorTexture, 0 ).x;\n		int j = int( i );\n		int x = j % size;\n		int y = j / size;\n		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );\n	}\n#endif",
	batching_vertex: "#ifdef USE_BATCHING\n	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );\n#endif",
	begin_vertex: "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n	vPosition = vec3( position );\n#endif",
	beginnormal_vertex: "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n	vec3 objectTangent = vec3( tangent.xyz );\n#endif",
	bsdfs: "float G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( specularColor, 1.0, dotVH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n} // validated",
	iridescence_fragment: "#ifdef USE_IRIDESCENCE\n	const mat3 XYZ_TO_REC709 = mat3(\n		 3.2404542, -0.9692660,  0.0556434,\n		-1.5371385,  1.8760108, -0.2040259,\n		-0.4985314,  0.0415560,  1.0572252\n	);\n	vec3 Fresnel0ToIor( vec3 fresnel0 ) {\n		vec3 sqrtF0 = sqrt( fresnel0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n	}\n	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n	}\n	float IorToFresnel0( float transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n	}\n	vec3 evalSensitivity( float OPD, vec3 shift ) {\n		float phase = 2.0 * PI * OPD * 1.0e-9;\n		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n		xyz /= 1.0685e-7;\n		vec3 rgb = XYZ_TO_REC709 * xyz;\n		return rgb;\n	}\n	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n		vec3 I;\n		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n		float cosTheta2Sq = 1.0 - sinTheta2Sq;\n		if ( cosTheta2Sq < 0.0 ) {\n			return vec3( 1.0 );\n		}\n		float cosTheta2 = sqrt( cosTheta2Sq );\n		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n		float R12 = F_Schlick( R0, 1.0, cosTheta1 );\n		float T121 = 1.0 - R12;\n		float phi12 = 0.0;\n		if ( iridescenceIOR < outsideIOR ) phi12 = PI;\n		float phi21 = PI - phi12;\n		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n		vec3 phi23 = vec3( 0.0 );\n		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n		vec3 phi = vec3( phi21 ) + phi23;\n		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n		vec3 r123 = sqrt( R123 );\n		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n		vec3 C0 = R12 + Rs;\n		I = C0;\n		vec3 Cm = Rs - T121;\n		for ( int m = 1; m <= 2; ++ m ) {\n			Cm *= r123;\n			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n			I += Cm * Sm;\n		}\n		return max( I, vec3( 0.0 ) );\n	}\n#endif",
	bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vBumpMapUv );\n		vec2 dSTdy = dFdy( vBumpMapUv );\n		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 ) * faceDirection;\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif",
	clipping_planes_fragment: "#if NUM_CLIPPING_PLANES > 0\n	vec4 plane;\n	#ifdef ALPHA_TO_COVERAGE\n		float distanceToPlane, distanceGradient;\n		float clipOpacity = 1.0;\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n			distanceGradient = fwidth( distanceToPlane ) / 2.0;\n			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			if ( clipOpacity == 0.0 ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			float unionClipOpacity = 1.0;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n				distanceGradient = fwidth( distanceToPlane ) / 2.0;\n				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			}\n			#pragma unroll_loop_end\n			clipOpacity *= 1.0 - unionClipOpacity;\n		#endif\n		diffuseColor.a *= clipOpacity;\n		if ( diffuseColor.a == 0.0 ) discard;\n	#else\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			bool clipped = true;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n			}\n			#pragma unroll_loop_end\n			if ( clipped ) discard;\n		#endif\n	#endif\n#endif",
	clipping_planes_pars_fragment: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
	clipping_planes_pars_vertex: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n#endif",
	clipping_planes_vertex: "#if NUM_CLIPPING_PLANES > 0\n	vClipPosition = - mvPosition.xyz;\n#endif",
	color_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	diffuseColor *= vColor;\n#endif",
	color_pars_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#endif",
	color_pars_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	varying vec4 vColor;\n#endif",
	color_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	vColor = vec4( 1.0 );\n#endif\n#ifdef USE_COLOR_ALPHA\n	vColor *= color;\n#elif defined( USE_COLOR )\n	vColor.rgb *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.rgb *= instanceColor.rgb;\n#endif\n#ifdef USE_BATCHING_COLOR\n	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );\n#endif",
	common: "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n	float precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n	float precisionSafeLength( vec3 v ) {\n		float maxComponent = max3( abs( v ) );\n		return length( v / maxComponent ) * maxComponent;\n	}\n#endif\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n	varying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n#define inverseTransformDirection transformDirectionByInverseViewMatrix\nvec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );\n}\nvec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n	return m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n	return vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated",
	cube_uv_reflection_fragment: "#ifdef ENVMAP_TYPE_CUBE_UV\n	#define cubeUV_minMipLevel 4.0\n	#define cubeUV_minTileSize 16.0\n	float getFace( vec3 direction ) {\n		vec3 absDirection = abs( direction );\n		float face = - 1.0;\n		if ( absDirection.x > absDirection.z ) {\n			if ( absDirection.x > absDirection.y )\n				face = direction.x > 0.0 ? 0.0 : 3.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		} else {\n			if ( absDirection.z > absDirection.y )\n				face = direction.z > 0.0 ? 2.0 : 5.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		}\n		return face;\n	}\n	vec2 getUV( vec3 direction, float face ) {\n		vec2 uv;\n		if ( face == 0.0 ) {\n			uv = vec2( direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 1.0 ) {\n			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n		} else if ( face == 2.0 ) {\n			uv = vec2( - direction.x, direction.y ) / abs( direction.z );\n		} else if ( face == 3.0 ) {\n			uv = vec2( - direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 4.0 ) {\n			uv = vec2( - direction.x, direction.z ) / abs( direction.y );\n		} else {\n			uv = vec2( direction.x, direction.y ) / abs( direction.z );\n		}\n		return 0.5 * ( uv + 1.0 );\n	}\n	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n		float face = getFace( direction );\n		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n		mipInt = max( mipInt, cubeUV_minMipLevel );\n		float faceSize = exp2( mipInt );\n		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n		if ( face > 2.0 ) {\n			uv.y += faceSize;\n			face -= 3.0;\n		}\n		uv.x += face * faceSize;\n		uv.x += filterInt * 3.0 * cubeUV_minTileSize;\n		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n		uv.x *= CUBEUV_TEXEL_WIDTH;\n		uv.y *= CUBEUV_TEXEL_HEIGHT;\n		#ifdef texture2DGradEXT\n			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n		#else\n			return texture2D( envMap, uv ).rgb;\n		#endif\n	}\n	#define cubeUV_r0 1.0\n	#define cubeUV_m0 - 2.0\n	#define cubeUV_r1 0.8\n	#define cubeUV_m1 - 1.0\n	#define cubeUV_r4 0.4\n	#define cubeUV_m4 2.0\n	#define cubeUV_r5 0.305\n	#define cubeUV_m5 3.0\n	#define cubeUV_r6 0.21\n	#define cubeUV_m6 4.0\n	float roughnessToMip( float roughness ) {\n		float mip = 0.0;\n		if ( roughness >= cubeUV_r1 ) {\n			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n		} else if ( roughness >= cubeUV_r4 ) {\n			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n		} else if ( roughness >= cubeUV_r5 ) {\n			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n		} else if ( roughness >= cubeUV_r6 ) {\n			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n		} else {\n			mip = - 2.0 * log2( 1.16 * roughness );		}\n		return mip;\n	}\n	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n		float mipF = fract( mip );\n		float mipInt = floor( mip );\n		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n		if ( mipF == 0.0 ) {\n			return vec4( color0, 1.0 );\n		} else {\n			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n			return vec4( mix( color0, color1, mipF ), 1.0 );\n		}\n	}\n#endif",
	defaultnormal_vertex: "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n	vec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n	mat3 bm = mat3( batchingMatrix );\n	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n	transformedNormal = bm * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = bm * transformedTangent;\n	#endif\n#endif\n#ifdef USE_INSTANCING\n	mat3 im = mat3( instanceMatrix );\n	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n	transformedNormal = im * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = im * transformedTangent;\n	#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n	transformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n#endif",
	displacementmap_pars_vertex: "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif",
	displacementmap_vertex: "#ifdef USE_DISPLACEMENTMAP\n	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif",
	emissivemap_fragment: "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE\n		emissiveColor = sRGBTransferEOTF( emissiveColor );\n	#endif\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
	emissivemap_pars_fragment: "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif",
	colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
	colorspace_pars_fragment: "vec4 LinearTransferOETF( in vec4 value ) {\n	return value;\n}\nvec4 sRGBTransferEOTF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}",
	envmap_fragment: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vec3 cameraToFrag;\n		if ( isOrthographic ) {\n			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToFrag = normalize( vWorldPosition - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToFrag, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );\n		#ifdef ENVMAP_BLENDING_MULTIPLY\n			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_MIX )\n			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_ADD )\n			outgoingLight += envColor.xyz * specularStrength * reflectivity;\n		#endif\n	#endif\n#endif",
	envmap_common_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float envMapIntensity;\n	uniform mat3 envMapRotation;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n#endif",
	envmap_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float reflectivity;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		varying vec3 vWorldPosition;\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif",
	envmap_pars_vertex: "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif",
	envmap_physical_pars_fragment: "#ifdef USE_ENVMAP\n	vec3 getIBLIrradiance( const in vec3 normal ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );\n			return PI * envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 reflectVec = reflect( - viewDir, normal );\n			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );\n			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n			return envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	#ifdef USE_RETROREFLECTION\n		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );\n				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );\n				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );\n				return envMapColor.rgb * envMapIntensity;\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n	#endif\n	#ifdef USE_ANISOTROPY\n		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 bentNormal = cross( bitangent, viewDir );\n				bentNormal = normalize( cross( bentNormal, bitangent ) );\n				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n				return getIBLRadiance( viewDir, bentNormal, roughness );\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n		#ifdef USE_RETROREFLECTION\n			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n				#ifdef ENVMAP_TYPE_CUBE_UV\n					vec3 bentNormal = cross( bitangent, viewDir );\n					bentNormal = normalize( cross( bentNormal, bitangent ) );\n					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n					return getIBLRetroRadiance( viewDir, bentNormal, roughness );\n				#else\n					return vec3( 0.0 );\n				#endif\n			}\n		#endif\n	#endif\n#endif",
	envmap_vertex: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex;\n		if ( isOrthographic ) {\n			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif",
	fog_vertex: "#ifdef USE_FOG\n	vFogDepth = - mvPosition.z;\n#endif",
	fog_pars_vertex: "#ifdef USE_FOG\n	varying float vFogDepth;\n#endif",
	fog_fragment: "#ifdef USE_FOG\n	#ifdef FOG_EXP2\n		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
	fog_pars_fragment: "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	varying float vFogDepth;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif",
	gradientmap_pars_fragment: "#ifdef USE_GRADIENTMAP\n	uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n	float dotNL = dot( normal, lightDirection );\n	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n	#ifdef USE_GRADIENTMAP\n		return vec3( texture2D( gradientMap, coord ).r );\n	#else\n		vec2 fw = fwidth( coord ) * 0.5;\n		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n	#endif\n}",
	lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif",
	lights_lambert_fragment: "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;",
	lights_lambert_pars_fragment: "varying vec3 vViewPosition;\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Lambert\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert",
	lights_pars_begin: "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n	uniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n	float x = normal.x, y = normal.y, z = normal.z;\n	vec3 result = shCoefficients[ 0 ] * 0.886227;\n	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n	return result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n	return irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	return irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n	if ( cutoffDistance > 0.0 ) {\n		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n	}\n	return distanceFalloff;\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n	return smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_SUN_LIGHTS > 0\n	struct SunLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];\n	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {\n		light.color = sunLight.color;\n		light.direction = sunLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n		light.color = directionalLight.color;\n		light.direction = directionalLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = pointLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		light.color = pointLight.color;\n		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n		light.visible = ( light.color != vec3( 0.0 ) );\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = spotLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float angleCos = dot( light.direction, spotLight.direction );\n		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n		if ( spotAttenuation > 0.0 ) {\n			float lightDistance = length( lVector );\n			light.color = spotLight.color * spotAttenuation;\n			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n			light.visible = ( light.color != vec3( 0.0 ) );\n		} else {\n			light.color = vec3( 0.0 );\n			light.visible = false;\n		}\n	}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n	struct RectAreaLight {\n		vec3 color;\n		vec3 position;\n		vec3 halfWidth;\n		vec3 halfHeight;\n	};\n	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;\n	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n		float dotNL = dot( normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		return irradiance;\n	}\n#endif\n#include <lightprobes_pars_fragment>",
	lights_toon_fragment: "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
	lights_toon_pars_fragment: "varying vec3 vViewPosition;\nstruct ToonMaterial {\n	vec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Toon\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon",
	lights_phong_fragment: "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
	lights_phong_pars_fragment: "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n	vec3 diffuseColor;\n	vec3 specularColor;\n	float specularShininess;\n	float specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong",
	lights_physical_fragment: "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.metalness = metalnessFactor;\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n	material.ior = ior;\n	#ifdef USE_SPECULAR\n		float specularIntensityFactor = specularIntensity;\n		vec3 specularColorFactor = specularColor;\n		#ifdef USE_SPECULAR_COLORMAP\n			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n		#endif\n		#ifdef USE_SPECULAR_INTENSITYMAP\n			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n		#endif\n		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n	#else\n		float specularIntensityFactor = 1.0;\n		vec3 specularColorFactor = vec3( 1.0 );\n		material.specularF90 = 1.0;\n	#endif\n	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = vec3( 0.04 );\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n	material.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n	material.clearcoat = clearcoat;\n	material.clearcoatRoughness = clearcoatRoughness;\n	material.clearcoatF0 = vec3( 0.04 );\n	material.clearcoatF90 = 1.0;\n	#ifdef USE_CLEARCOATMAP\n		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n	#endif\n	#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n	#endif\n	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n	material.clearcoatRoughness += geometryRoughness;\n	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_DISPERSION\n	material.dispersion = dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	material.retroreflectivity = retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	material.iridescence = iridescence;\n	material.iridescenceIOR = iridescenceIOR;\n	#ifdef USE_IRIDESCENCEMAP\n		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n	#endif\n	#ifdef USE_IRIDESCENCE_THICKNESSMAP\n		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n	#else\n		material.iridescenceThickness = iridescenceThicknessMaximum;\n	#endif\n#endif\n#ifdef USE_SHEEN\n	material.sheenColor = sheenColor;\n	#ifdef USE_SHEEN_COLORMAP\n		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n	#endif\n	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	#ifdef USE_ANISOTROPYMAP\n		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n	#else\n		vec2 anisotropyV = anisotropyVector;\n	#endif\n	material.anisotropy = length( anisotropyV );\n	if( material.anisotropy == 0.0 ) {\n		anisotropyV = vec2( 1.0, 0.0 );\n	} else {\n		anisotropyV /= material.anisotropy;\n		material.anisotropy = saturate( material.anisotropy );\n	}\n	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif",
	lights_physical_pars_fragment: "uniform sampler2D dfgLUT;\nstruct PhysicalMaterial {\n	vec3 diffuseColor;\n	vec3 diffuseContribution;\n	vec3 specularColor;\n	vec3 specularColorBlended;\n	float roughness;\n	float metalness;\n	float specularF90;\n	float dispersion;\n	vec2 dfg;\n	vec3 multiScatteringCompensation;\n	#ifdef USE_RETROREFLECTION\n		float retroreflectivity;\n	#endif\n	#ifdef USE_CLEARCOAT\n		float clearcoat;\n		float clearcoatRoughness;\n		vec3 clearcoatF0;\n		float clearcoatF90;\n	#endif\n	#ifdef USE_IRIDESCENCE\n		float iridescence;\n		float iridescenceIOR;\n		float iridescenceThickness;\n		vec3 iridescenceFresnel;\n		vec3 iridescenceF0Dielectric;\n		vec3 iridescenceF0Metallic;\n	#endif\n	#ifdef USE_SHEEN\n		vec3 sheenColor;\n		float sheenRoughness;\n	#endif\n	#ifdef IOR\n		float ior;\n	#endif\n	#ifdef USE_TRANSMISSION\n		float transmission;\n		float transmissionAlpha;\n		float thickness;\n		float attenuationDistance;\n		vec3 attenuationColor;\n	#endif\n	#ifdef USE_ANISOTROPY\n		float anisotropy;\n		float alphaT;\n		vec3 anisotropyT;\n		vec3 anisotropyB;\n	#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n		return 0.5 / max( gv + gl, EPSILON );\n	}\n	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n		float a2 = alphaT * alphaB;\n		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n		highp float v2 = dot( v, v );\n		float w2 = a2 / v2;\n		return RECIPROCAL_PI * a2 * pow2 ( w2 );\n	}\n#endif\n#ifdef USE_CLEARCOAT\n	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n		vec3 f0 = material.clearcoatF0;\n		float f90 = material.clearcoatF90;\n		float roughness = material.clearcoatRoughness;\n		float alpha = pow2( roughness );\n		vec3 halfDir = normalize( lightDir + viewDir );\n		float dotNL = saturate( dot( normal, lightDir ) );\n		float dotNV = saturate( dot( normal, viewDir ) );\n		float dotNH = saturate( dot( normal, halfDir ) );\n		float dotVH = saturate( dot( viewDir, halfDir ) );\n		vec3 F = F_Schlick( f0, f90, dotVH );\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n		return F * ( V * D );\n	}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 f0 = material.specularColorBlended;\n	float f90 = material.specularF90;\n	float roughness = material.roughness;\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( f0, f90, dotVH );\n	#ifdef USE_IRIDESCENCE\n		F = mix( F, material.iridescenceFresnel, material.iridescence );\n	#endif\n	#ifdef USE_ANISOTROPY\n		float dotTL = dot( material.anisotropyT, lightDir );\n		float dotTV = dot( material.anisotropyT, viewDir );\n		float dotTH = dot( material.anisotropyT, halfDir );\n		float dotBL = dot( material.anisotropyB, lightDir );\n		float dotBV = dot( material.anisotropyB, viewDir );\n		float dotBH = dot( material.anisotropyB, halfDir );\n		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n	#else\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n	#endif\n	return F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n	const float LUT_SIZE = 64.0;\n	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n	const float LUT_BIAS = 0.5 / LUT_SIZE;\n	float dotNV = saturate( dot( N, V ) );\n	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n	uv = uv * LUT_SCALE + LUT_BIAS;\n	return uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n	float l = length( f );\n	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n	float x = dot( v1, v2 );\n	float y = abs( x );\n	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n	float v = a / b;\n	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n	return cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n	vec3 lightNormal = cross( v1, v2 );\n	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n	vec3 T1, T2;\n	T1 = normalize( V - N * dot( V, N ) );\n	T2 = - cross( N, T1 );\n	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );\n	vec3 coords[ 4 ];\n	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n	coords[ 0 ] = normalize( coords[ 0 ] );\n	coords[ 1 ] = normalize( coords[ 1 ] );\n	coords[ 2 ] = normalize( coords[ 2 ] );\n	coords[ 3 ] = normalize( coords[ 3 ] );\n	vec3 vectorFormFactor = vec3( 0.0 );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n	return vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n	float alpha = pow2( roughness );\n	float invAlpha = 1.0 / alpha;\n	float cos2h = dotNH * dotNH;\n	float sin2h = max( 1.0 - cos2h, 0.0078125 );\n	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float D = D_Charlie( sheenRoughness, dotNH );\n	float V = V_Neubelt( dotNV, dotNL );\n	return sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float r2 = roughness * roughness;\n	float rInv = 1.0 / ( roughness + 0.1 );\n	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;\n	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;\n	float DG = exp( a * dotNV + b );\n	return saturate( DG );\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;\n	return specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n	#ifdef USE_IRIDESCENCE\n		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n	#else\n		vec3 Fr = specularColor;\n	#endif\n	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n	float Ess = fab.x + fab.y;\n	float Ems = 1.0 - Ess;\n	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n	singleScatter += FssEss;\n	multiScatter += Fms * Ems;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n		vec3 normal = geometryNormal;\n		vec3 viewDir = geometryViewDir;\n		vec3 position = geometryPosition;\n		vec3 lightPos = rectAreaLight.position;\n		vec3 halfWidth = rectAreaLight.halfWidth;\n		vec3 halfHeight = rectAreaLight.halfHeight;\n		vec3 lightColor = rectAreaLight.color;\n		float roughness = material.roughness;\n		vec3 rectCoords[ 4 ];\n		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n		vec2 uv = LTC_Uv( normal, viewDir, roughness );\n		vec4 t1 = texture2D( ltc_1, uv );\n		vec4 t2 = texture2D( ltc_2, uv );\n		mat3 mInv = mat3(\n			vec3( t1.x, 0, t1.y ),\n			vec3(    0, 1,    0 ),\n			vec3( t1.z, 0, t1.w )\n		);\n		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );\n		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n		#ifdef USE_CLEARCOAT\n			vec3 Ncc = geometryClearcoatNormal;\n			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );\n			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );\n			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );\n			mat3 mInvClearcoat = mat3(\n				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),\n				vec3(             0, 1,             0 ),\n				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )\n			);\n			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;\n			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );\n		#endif\n	}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifdef USE_CLEARCOAT\n		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n		vec3 ccIrradiance = dotNLcc * directLight.color;\n		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n	#endif\n	#ifdef USE_SHEEN\n \n 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n \n 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );\n \n 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );\n \n 		irradiance *= sheenEnergyComp;\n \n 	#endif\n	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );\n		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );\n		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;\n	vec3 halfDir = normalize( directLight.direction + geometryViewDir );\n	float dotVH = saturate( dot( geometryViewDir, halfDir ) );\n	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );\n		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );\n		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );\n		F = mix( F, retroF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 singleScattering = vec3( 0.0 );\n	vec3 multiScattering = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );\n	#endif\n	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		diffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectDiffuse += diffuse;\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n	#ifdef USE_CLEARCOAT\n		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;\n 	#endif\n	vec3 singleScatteringDielectric = vec3( 0.0 );\n	vec3 multiScatteringDielectric = vec3( 0.0 );\n	vec3 singleScatteringMetallic = vec3( 0.0 );\n	vec3 multiScatteringMetallic = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );\n	#endif\n	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );\n	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );\n	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;\n	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );\n	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n	vec3 indirectSpecular = radiance * singleScattering;\n	indirectSpecular += multiScattering * cosineWeightedIrradiance;\n	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		indirectSpecular *= sheenEnergyComp;\n		indirectDiffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectSpecular += indirectSpecular;\n	reflectedLight.indirectDiffuse += indirectDiffuse;\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_Direct_RectArea		RE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
	lights_fragment_begin: "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n	geometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n	float dotNVi = saturate( dot( normal, geometryViewDir ) );\n	if ( material.iridescenceThickness == 0.0 ) {\n		material.iridescence = 0.0;\n	} else {\n		material.iridescence = saturate( material.iridescence );\n	}\n	if ( material.iridescence > 0.0 ) {\n		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );\n		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );\n		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );\n		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );\n	}\n#endif\n#ifdef STANDARD\n	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );\n	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;\n	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )\n		float EssMs = material.dfg.x + material.dfg.y;\n		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );\n	#endif\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointLightInfo( pointLight, geometryPosition, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n		pointLightShadow = pointLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	vec4 spotColor;\n	vec3 spotLightCoord;\n	bool inSpotLightMap;\n	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotLightInfo( spotLight, geometryPosition, directLight );\n		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n		#else\n		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#endif\n		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n		#endif\n		#undef SPOT_LIGHT_MAP_INDEX\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		spotLightShadow = spotLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )\n	SunLight sunLight;\n	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {\n		sunLight = sunLights[ i ];\n		getSunLightInfo( sunLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )\n		sunLightShadow = sunLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalLightInfo( directionalLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n		directionalLightShadow = directionalLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n	RectAreaLight rectAreaLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n		rectAreaLight = rectAreaLights[ i ];\n		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 iblIrradiance = vec3( 0.0 );\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#if defined( USE_LIGHT_PROBES )\n		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n		}\n		#pragma unroll_loop_end\n	#endif\n	#ifdef USE_LIGHT_PROBES_GRID\n		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;\n		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );\n		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );\n	#endif\n#endif\n#if defined( RE_IndirectSpecular )\n	vec3 radiance = vec3( 0.0 );\n	vec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
	lights_fragment_maps: "#if defined( RE_IndirectDiffuse )\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n		irradiance += lightMapIrradiance;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )\n		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )\n			iblIrradiance += getIBLIrradiance( geometryNormal );\n		#endif\n	#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	#ifdef USE_ANISOTROPY\n		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n	#else\n		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n	#endif\n	#ifdef USE_RETROREFLECTION\n		#ifdef USE_ANISOTROPY\n			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n		#else\n			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );\n		#endif\n		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );\n	#endif\n	radiance += iblRadiance;\n	#ifdef USE_CLEARCOAT\n		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n	#endif\n#endif",
	lights_fragment_end: "#if defined( RE_IndirectDiffuse )\n	#if defined( LAMBERT ) || defined( PHONG )\n		irradiance += iblIrradiance;\n	#endif\n	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif",
	lightprobes_pars_fragment: "#ifdef USE_LIGHT_PROBES_GRID\nuniform highp sampler3D probesSH;\nuniform vec3 probesMin;\nuniform vec3 probesMax;\nuniform vec3 probesResolution;\nvec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {\n	vec3 res = probesResolution;\n	vec3 gridRange = probesMax - probesMin;\n	vec3 resMinusOne = res - 1.0;\n	vec3 probeSpacing = gridRange / resMinusOne;\n	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;\n	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );\n	uvw = uvw * resMinusOne / res + 0.5 / res;\n	float nz          = res.z;\n	float paddedSlices = nz + 2.0;\n	float atlasDepth  = 7.0 * paddedSlices;\n	float uvZBase     = uvw.z * nz + 1.0;\n	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );\n	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );\n	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );\n	vec3 c0 = s0.xyz;\n	vec3 c1 = vec3( s0.w, s1.xy );\n	vec3 c2 = vec3( s1.zw, s2.x );\n	vec3 c3 = s2.yzw;\n	vec3 c4 = s3.xyz;\n	vec3 c5 = vec3( s3.w, s4.xy );\n	vec3 c6 = vec3( s4.zw, s5.x );\n	vec3 c7 = s5.yzw;\n	vec3 c8 = s6.xyz;\n	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;\n	vec3 result = c0 * 0.886227;\n	result += c1 * 2.0 * 0.511664 * y;\n	result += c2 * 2.0 * 0.511664 * z;\n	result += c3 * 2.0 * 0.511664 * x;\n	result += c4 * 2.0 * 0.429043 * x * y;\n	result += c5 * 2.0 * 0.429043 * y * z;\n	result += c6 * ( 0.743125 * z * z - 0.247708 );\n	result += c7 * 2.0 * 0.429043 * x * z;\n	result += c8 * 0.429043 * ( x * x - y * y );\n	return max( result, vec3( 0.0 ) );\n}\n#endif",
	logdepthbuf_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
	logdepthbuf_pars_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	uniform float logDepthBufFC;\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_pars_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	vFragDepth = 1.0 + gl_Position.w;\n	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n#endif",
	map_fragment: "#ifdef USE_MAP\n	vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );\n	#endif\n	diffuseColor *= sampledDiffuseColor;\n#endif",
	map_pars_fragment: "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif",
	map_particle_fragment: "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n	#if defined( USE_POINTS_UV )\n		vec2 uv = vUv;\n	#else\n		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n	#endif\n#endif\n#ifdef USE_MAP\n	diffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
	map_particle_pars_fragment: "#if defined( USE_POINTS_UV )\n	varying vec2 vUv;\n#else\n	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n		uniform mat3 uvTransform;\n	#endif\n#endif\n#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	metalnessmap_fragment: "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n	metalnessFactor *= texelMetalness.b;\n#endif",
	metalnessmap_pars_fragment: "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif",
	morphinstance_vertex: "#ifdef USE_INSTANCING_MORPH\n	float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;\n	}\n#endif",
	morphcolor_vertex: "#if defined( USE_MORPHCOLORS )\n	vColor *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		#if defined( USE_COLOR_ALPHA )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n		#elif defined( USE_COLOR )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n		#endif\n	}\n#endif",
	morphnormal_vertex: "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n	#ifndef USE_INSTANCING_MORPH\n		uniform float morphTargetBaseInfluence;\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	#endif\n	uniform sampler2DArray morphTargetsTexture;\n	uniform ivec2 morphTargetsTextureSize;\n	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n		int y = texelIndex / morphTargetsTextureSize.x;\n		int x = texelIndex - y * morphTargetsTextureSize.x;\n		ivec3 morphUV = ivec3( x, y, morphTargetIndex );\n		return texelFetch( morphTargetsTexture, morphUV, 0 );\n	}\n#endif",
	morphtarget_vertex: "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	normal_fragment_begin: "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal *= faceDirection;\n	#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n	#ifdef USE_TANGENT\n		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn = getTangentFrame( - vViewPosition, normal,\n		#if defined( USE_NORMALMAP )\n			vNormalMapUv\n		#elif defined( USE_CLEARCOAT_NORMALMAP )\n			vClearcoatNormalMapUv\n		#else\n			vUv\n		#endif\n		);\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn[0] *= faceDirection;\n		tbn[1] *= faceDirection;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	#ifdef USE_TANGENT\n		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn2[0] *= faceDirection;\n		tbn2[1] *= faceDirection;\n	#endif\n#endif\nvec3 nonPerturbedNormal = normal;",
	normal_fragment_maps: "#ifdef USE_NORMALMAP_OBJECTSPACE\n	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#ifdef FLIP_SIDED\n		normal = - normal;\n	#endif\n	#ifdef DOUBLE_SIDED\n		normal = normal * faceDirection;\n	#endif\n	normal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#if defined( USE_PACKED_NORMALMAP )\n		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );\n	#endif\n	mapN.xy *= normalScale;\n	normal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif",
	normal_pars_fragment: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_pars_vertex: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_vertex: "#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n	#ifdef USE_TANGENT\n		vTangent = normalize( transformedTangent );\n		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n		#ifdef FLIP_SIDED\n			vBitangent = - vBitangent;\n		#endif\n	#endif\n#endif",
	normalmap_pars_fragment: "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n	uniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		vec3 N = surf_norm;\n		vec3 q1perp = cross( q1, N );\n		vec3 q0perp = cross( N, q0 );\n		vec3 T = q1perp * st0.x + q0perp * st1.x;\n		vec3 B = q1perp * st0.y + q0perp * st1.y;\n		float det = max( dot( T, T ), dot( B, B ) );\n		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n		return mat3( T * scale, B * scale, N );\n	}\n#endif",
	clearcoat_normal_fragment_begin: "#ifdef USE_CLEARCOAT\n	vec3 clearcoatNormal = nonPerturbedNormal;\n#endif",
	clearcoat_normal_fragment_maps: "#ifdef USE_CLEARCOAT_NORMALMAP\n	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n	clearcoatMapN.xy *= clearcoatNormalScale;\n	clearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif",
	clearcoat_pars_fragment: "#ifdef USE_CLEARCOATMAP\n	uniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform sampler2D clearcoatNormalMap;\n	uniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform sampler2D clearcoatRoughnessMap;\n#endif",
	iridescence_pars_fragment: "#ifdef USE_IRIDESCENCEMAP\n	uniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform sampler2D iridescenceThicknessMap;\n#endif",
	opaque_fragment: "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );",
	packing: "vec3 packNormalToRGB( const in vec3 normal ) {\n	return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n	return 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;\nconst float Inv255 = 1. / 255.;\nconst vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );\nconst vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );\nconst vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );\nconst vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );\nvec4 packDepthToRGBA( const in float v ) {\n	if( v <= 0.0 )\n		return vec4( 0., 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec4( 1., 1., 1., 1. );\n	float vuf;\n	float af = modf( v * PackFactors.a, vuf );\n	float bf = modf( vuf * ShiftRight8, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );\n}\nvec3 packDepthToRGB( const in float v ) {\n	if( v <= 0.0 )\n		return vec3( 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec3( 1., 1., 1. );\n	float vuf;\n	float bf = modf( v * PackFactors.b, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec3( vuf * Inv255, gf * PackUpscale, bf );\n}\nvec2 packDepthToRG( const in float v ) {\n	if( v <= 0.0 )\n		return vec2( 0., 0. );\n	if( v >= 1.0 )\n		return vec2( 1., 1. );\n	float vuf;\n	float gf = modf( v * 256., vuf );\n	return vec2( vuf * Inv255, gf );\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors4 );\n}\nfloat unpackRGBToDepth( const in vec3 v ) {\n	return dot( v, UnpackFactors3 );\n}\nfloat unpackRGToDepth( const in vec2 v ) {\n	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;\n}\nvec4 pack2HalfToRGBA( const in vec2 v ) {\n	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( const in vec4 v ) {\n	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n	\n		return depth * ( far - near ) - far;\n	#else\n		return depth * ( near - far ) - near;\n	#endif\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		return ( near * far ) / ( ( near - far ) * depth - near );\n	#else\n		return ( near * far ) / ( ( far - near ) * depth - far );\n	#endif\n}",
	premultiplied_alpha_fragment: "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif",
	project_vertex: "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n	mvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n	mvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
	dithering_fragment: "#ifdef DITHERING\n	gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
	dithering_pars_fragment: "#ifdef DITHERING\n	vec3 dithering( vec3 color ) {\n		float grid_position = rand( gl_FragCoord.xy );\n		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n		return color + dither_shift_RGB;\n	}\n#endif",
	roughnessmap_fragment: "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n	roughnessFactor *= texelRoughness.g;\n#endif",
	roughnessmap_pars_fragment: "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif",
	shadowmap_pars_fragment: "#if NUM_SPOT_LIGHT_COORDS > 0\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		#define SUN_LIGHT_CASCADES 2\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#endif\n		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n		struct SunLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#endif\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#elif defined( SHADOWMAP_TYPE_BASIC )\n			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float interleavedGradientNoise( vec2 position ) {\n			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );\n		}\n		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {\n			const float goldenAngle = 2.399963229728653;\n			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );\n			float theta = float( sampleIndex ) * goldenAngle + phi;\n			return vec2( cos( theta ), sin( theta ) ) * r;\n		}\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			shadowCoord.z += shadowBias;\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n				float radius = shadowRadius * texelSize.x;\n				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n				shadow = (\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )\n				) * 0.2;\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#elif defined( SHADOWMAP_TYPE_VSM )\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;\n				float mean = distribution.x;\n				float variance = distribution.y * distribution.y;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					float hard_shadow = step( mean, shadowCoord.z );\n				#else\n					float hard_shadow = step( shadowCoord.z, mean );\n				#endif\n				\n				if ( hard_shadow == 1.0 ) {\n					shadow = 1.0;\n				} else {\n					variance = max( variance, 0.0000001 );\n					float d = shadowCoord.z - mean;\n					float p_max = variance / ( variance + d * d );\n					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );\n					shadow = max( hard_shadow, p_max );\n				}\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#else\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				float depth = texture2D( shadowMap, shadowCoord.xy ).r;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					shadow = step( depth, shadowCoord.z );\n				#else\n					shadow = step( shadowCoord.z, depth );\n				#endif\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#endif\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		float getSunShadow(\n			#if defined( SHADOWMAP_TYPE_PCF )\n				sampler2DShadow shadowMap,\n			#else\n				sampler2D shadowMap,\n			#endif\n			SunLightShadow sunLightShadow,\n			int shadowIndex\n		) {\n			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );\n			float viewDepth = vSunShadowWorldPosition.w;\n			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;\n			float shadow = 1.0;\n			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {\n				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];\n				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {\n					float cascadeShadow = getShadow(\n						shadowMap,\n						sunLightShadow.shadowMapSize,\n						sunLightShadow.shadowIntensity,\n						sunLightShadow.shadowBias,\n						sunLightShadow.shadowRadius,\n						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition\n					);\n					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );\n				}\n			}\n			return shadow;\n		}\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n	#if defined( SHADOWMAP_TYPE_PCF )\n	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp -= shadowBias;\n			#else\n				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp += shadowBias;\n			#endif\n			float texelSize = shadowRadius / shadowMapSize.x;\n			vec3 absDir = abs( bd3D );\n			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );\n			tangent = normalize( cross( bd3D, tangent ) );\n			vec3 bitangent = cross( bd3D, tangent );\n			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n			vec2 sample0 = vogelDiskSample( 0, 5, phi );\n			vec2 sample1 = vogelDiskSample( 1, 5, phi );\n			vec2 sample2 = vogelDiskSample( 2, 5, phi );\n			vec2 sample3 = vogelDiskSample( 3, 5, phi );\n			vec2 sample4 = vogelDiskSample( 4, 5, phi );\n			shadow = (\n				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )\n			) * 0.2;\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#elif defined( SHADOWMAP_TYPE_BASIC )\n	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n			dp += shadowBias;\n			vec3 bd3D = normalize( lightToPosition );\n			float depth = textureCube( shadowMap, bd3D ).r;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				depth = 1.0 - depth;\n			#endif\n			shadow = step( dp, depth );\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#endif\n	#endif\n#endif",
	shadowmap_pars_vertex: "#if NUM_SPOT_LIGHT_COORDS > 0\n	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n#endif",
	shadowmap_vertex: "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n	#ifdef HAS_NORMAL\n		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n	#else\n		vec3 shadowWorldNormal = vec3( 0.0 );\n	#endif\n	vec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );\n		vSunShadowWorldNormal = shadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n		shadowWorldPosition = worldPosition;\n		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n		#endif\n		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n	}\n	#pragma unroll_loop_end\n#endif",
	shadowmask_pars_fragment: "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {\n		sunLight = sunLightShadows[ i ];\n		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n		directionalLight = directionalLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n		spotLight = spotLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n	PointLightShadow pointLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n		pointLight = pointLightShadows[ i ];\n		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#endif\n	return shadow;\n}",
	skinbase_vertex: "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
	skinning_pars_vertex: "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	uniform highp sampler2D boneTexture;\n	mat4 getBoneMatrix( const in float i ) {\n		int size = textureSize( boneTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif",
	skinning_vertex: "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	transformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
	skinnormal_vertex: "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n	#ifdef USE_TANGENT\n		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n	#endif\n#endif",
	specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif",
	specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif",
	tonemapping_fragment: "#if defined( TONE_MAPPING )\n	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
	tonemapping_pars_fragment: "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n	return saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	return saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 CineonToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	color = max( vec3( 0.0 ), color - 0.004 );\n	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n	return a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n	const mat3 ACESInputMat = mat3(\n		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),\n		vec3( 0.04823, 0.01566, 0.83777 )\n	);\n	const mat3 ACESOutputMat = mat3(\n		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),\n		vec3( -0.07367, -0.00605,  1.07602 )\n	);\n	color *= toneMappingExposure / 0.6;\n	color = ACESInputMat * color;\n	color = RRTAndODTFit( color );\n	color = ACESOutputMat * color;\n	return saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n	vec3( 1.6605, - 0.1246, - 0.0182 ),\n	vec3( - 0.5876, 1.1329, - 0.1006 ),\n	vec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n	vec3( 0.6274, 0.0691, 0.0164 ),\n	vec3( 0.3293, 0.9195, 0.0880 ),\n	vec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n	vec3 x2 = x * x;\n	vec3 x4 = x2 * x2;\n	return + 15.5 * x4 * x2\n		- 40.14 * x4 * x\n		+ 31.96 * x4\n		- 6.868 * x2 * x\n		+ 0.4298 * x2\n		+ 0.1191 * x\n		- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n	const mat3 AgXInsetMatrix = mat3(\n		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n	);\n	const mat3 AgXOutsetMatrix = mat3(\n		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n	);\n	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;\n	color *= toneMappingExposure;\n	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n	color = AgXInsetMatrix * color;\n	color = max( color, 1e-10 );	color = log2( color );\n	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n	color = clamp( color, 0.0, 1.0 );\n	color = agxDefaultContrastApprox( color );\n	color = AgXOutsetMatrix * color;\n	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n	color = clamp( color, 0.0, 1.0 );\n	return color;\n}\nvec3 NeutralToneMapping( vec3 color ) {\n	const float StartCompression = 0.8 - 0.04;\n	const float Desaturation = 0.15;\n	color *= toneMappingExposure;\n	float x = min( color.r, min( color.g, color.b ) );\n	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n	color -= offset;\n	float peak = max( color.r, max( color.g, color.b ) );\n	if ( peak < StartCompression ) return color;\n	float d = 1. - StartCompression;\n	float newPeak = 1. - d * d / ( peak + d - StartCompression );\n	color *= newPeak / peak;\n	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n	return mix( color, vec3( newPeak ), g );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
	transmission_fragment: "#ifdef USE_TRANSMISSION\n	material.transmission = transmission;\n	material.transmissionAlpha = 1.0;\n	material.thickness = thickness;\n	material.attenuationDistance = attenuationDistance;\n	material.attenuationColor = attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n	#endif\n	vec3 pos = vWorldPosition;\n	vec3 v = normalize( cameraPosition - pos );\n	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec4 transmitted = getIBLVolumeRefraction(\n		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,\n		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,\n		material.attenuationColor, material.attenuationDistance );\n	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif",
	transmission_pars_fragment: "#ifdef USE_TRANSMISSION\n	uniform float transmission;\n	uniform float thickness;\n	uniform float attenuationDistance;\n	uniform vec3 attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		uniform sampler2D transmissionMap;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		uniform sampler2D thicknessMap;\n	#endif\n	uniform vec2 transmissionSamplerSize;\n	uniform sampler2D transmissionSamplerMap;\n	uniform mat4 modelMatrix;\n	uniform mat4 projectionMatrix;\n	varying vec3 vWorldPosition;\n	float w0( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n	}\n	float w1( float a ) {\n		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n	}\n	float w2( float a ){\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n	}\n	float w3( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * a * a );\n	}\n	float g0( float a ) {\n		return w0( a ) + w1( a );\n	}\n	float g1( float a ) {\n		return w2( a ) + w3( a );\n	}\n	float h0( float a ) {\n		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n	}\n	float h1( float a ) {\n		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n	}\n	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n		uv = uv * texelSize.zw + 0.5;\n		vec2 iuv = floor( uv );\n		vec2 fuv = fract( uv );\n		float g0x = g0( fuv.x );\n		float g1x = g1( fuv.x );\n		float h0x = h0( fuv.x );\n		float h1x = h1( fuv.x );\n		float h0y = h0( fuv.y );\n		float h1y = h1( fuv.y );\n		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n	}\n	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n		vec2 fLodSizeInv = 1.0 / fLodSize;\n		vec2 cLodSizeInv = 1.0 / cLodSize;\n		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n		return mix( fSample, cSample, fract( lod ) );\n	}\n	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n		vec3 modelScale;\n		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n		return normalize( refractionVector ) * thickness * modelScale;\n	}\n	float applyIorToRoughness( const in float roughness, const in float ior ) {\n		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n	}\n	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n	}\n	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n		if ( isinf( attenuationDistance ) ) {\n			return vec3( 1.0 );\n		} else {\n			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;\n		}\n	}\n	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,\n		const in vec3 attenuationColor, const in float attenuationDistance ) {\n		vec4 transmittedLight;\n		vec3 transmittance;\n		#ifdef USE_DISPERSION\n			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;\n			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );\n			for ( int i = 0; i < 3; i ++ ) {\n				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );\n				vec3 refractedRayExit = position + transmissionRay;\n				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n				vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n				refractionCoords += 1.0;\n				refractionCoords /= 2.0;\n				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );\n				transmittedLight[ i ] = transmissionSample[ i ];\n				transmittedLight.a += transmissionSample.a;\n				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];\n			}\n			transmittedLight.a /= 3.0;\n		#else\n			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n			vec3 refractedRayExit = position + transmissionRay;\n			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n			vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n			refractionCoords += 1.0;\n			refractionCoords /= 2.0;\n			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n		#endif\n		vec3 attenuatedColor = transmittance * transmittedLight.rgb;\n		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n	}\n#endif",
	uv_pars_fragment: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_pars_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	uniform mat3 mapTransform;\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform mat3 alphaMapTransform;\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	uniform mat3 lightMapTransform;\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	uniform mat3 aoMapTransform;\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	uniform mat3 bumpMapTransform;\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	uniform mat3 normalMapTransform;\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	uniform mat3 displacementMapTransform;\n	varying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	uniform mat3 emissiveMapTransform;\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	uniform mat3 metalnessMapTransform;\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	uniform mat3 roughnessMapTransform;\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	uniform mat3 anisotropyMapTransform;\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	uniform mat3 clearcoatMapTransform;\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform mat3 clearcoatNormalMapTransform;\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform mat3 clearcoatRoughnessMapTransform;\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	uniform mat3 sheenColorMapTransform;\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	uniform mat3 sheenRoughnessMapTransform;\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	uniform mat3 iridescenceMapTransform;\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform mat3 iridescenceThicknessMapTransform;\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	uniform mat3 specularMapTransform;\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	uniform mat3 specularColorMapTransform;\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	uniform mat3 specularIntensityMapTransform;\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	vUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif",
	worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n	vec4 worldPosition = vec4( transformed, 1.0 );\n	#ifdef USE_BATCHING\n		worldPosition = batchingMatrix * worldPosition;\n	#endif\n	#ifdef USE_INSTANCING\n		worldPosition = instanceMatrix * worldPosition;\n	#endif\n	worldPosition = modelMatrix * worldPosition;\n#endif",
	background_vert: "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	gl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
	background_frag: "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n	vec4 texColor = texture2D( t2D, vUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	backgroundCube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	backgroundCube_frag: "#ifdef ENVMAP_TYPE_CUBE\n	uniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n	uniform sampler2D envMap;\n#endif\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nuniform mat3 backgroundRotation;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );\n	#elif defined( ENVMAP_TYPE_CUBE_UV )\n		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );\n	#else\n		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	cube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	cube_frag: "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n	gl_FragColor = texColor;\n	gl_FragColor.a *= opacity;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	depth_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vHighPrecisionZW = gl_Position.zw;\n}",
	depth_frag: "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <logdepthbuf_fragment>\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];\n	#else\n		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;\n	#endif\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( fragCoordZ );\n	#elif DEPTH_PACKING == 3202\n		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );\n	#elif DEPTH_PACKING == 3203\n		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );\n	#endif\n}",
	distance_vert: "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition.xyz;\n}",
	distance_frag: "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	float dist = length( vWorldPosition - referencePosition );\n	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n	dist = saturate( dist );\n	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );\n}",
	equirect_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n}",
	equirect_frag: "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vec3 direction = normalize( vWorldDirection );\n	vec2 sampleUV = equirectUv( direction );\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	linedashed_vert: "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vLineDistance = scale * lineDistance;\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	linedashed_frag: "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	meshbasic_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinbase_vertex>\n		#include <skinnormal_vertex>\n		#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <fog_vertex>\n}",
	meshbasic_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n	#else\n		reflectedLight.indirectDiffuse += vec3( 1.0 );\n	#endif\n	#include <aomap_fragment>\n	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshlambert_vert: "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshlambert_frag: "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_lambert_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshmatcap_vert: "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n	vViewPosition = - mvPosition.xyz;\n}",
	meshmatcap_frag: "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	vec3 viewDir = normalize( vViewPosition );\n	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n	vec3 y = cross( viewDir, x );\n	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n	#ifdef USE_MATCAP\n		vec4 matcapColor = texture2D( matcap, uv );\n	#else\n		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n	#endif\n	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshnormal_vert: "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	vViewPosition = - mvPosition.xyz;\n#endif\n}",
	meshnormal_frag: "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );\n	#ifdef OPAQUE\n		gl_FragColor.a = 1.0;\n	#endif\n}",
	meshphong_vert: "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshphong_frag: "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshphysical_vert: "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n	varying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n	vWorldPosition = worldPosition.xyz;\n#endif\n}",
	meshphysical_frag: "#define STANDARD\n#ifdef PHYSICAL\n	#define IOR\n	#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n	uniform float ior;\n#endif\n#ifdef USE_SPECULAR\n	uniform float specularIntensity;\n	uniform vec3 specularColor;\n	#ifdef USE_SPECULAR_COLORMAP\n		uniform sampler2D specularColorMap;\n	#endif\n	#ifdef USE_SPECULAR_INTENSITYMAP\n		uniform sampler2D specularIntensityMap;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT\n	uniform float clearcoat;\n	uniform float clearcoatRoughness;\n#endif\n#ifdef USE_DISPERSION\n	uniform float dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	uniform float retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	uniform float iridescence;\n	uniform float iridescenceIOR;\n	uniform float iridescenceThicknessMinimum;\n	uniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n	uniform vec3 sheenColor;\n	uniform float sheenRoughness;\n	#ifdef USE_SHEEN_COLORMAP\n		uniform sampler2D sheenColorMap;\n	#endif\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		uniform sampler2D sheenRoughnessMap;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	uniform vec2 anisotropyVector;\n	#ifdef USE_ANISOTROPYMAP\n		uniform sampler2D anisotropyMap;\n	#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <clearcoat_normal_fragment_begin>\n	#include <clearcoat_normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n	#include <transmission_fragment>\n	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n	#ifdef USE_SHEEN\n \n		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;\n \n 	#endif\n	#ifdef USE_CLEARCOAT\n		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n	#endif\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshtoon_vert: "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshtoon_frag: "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_toon_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	points_vert: "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n	varying vec2 vUv;\n	uniform mat3 uvTransform;\n#endif\nvoid main() {\n	#ifdef USE_POINTS_UV\n		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	#endif\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	gl_PointSize = size;\n	#ifdef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <fog_vertex>\n}",
	points_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	shadow_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	shadow_frag: "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	#include <logdepthbuf_fragment>\n	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	sprite_vert: "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	vec4 mvPosition = modelViewMatrix[ 3 ];\n	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );\n	#ifndef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) scale *= - mvPosition.z;\n	#endif\n	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n	vec2 rotatedPosition;\n	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n	mvPosition.xy += rotatedPosition;\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	sprite_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}"
}, X = {
	common: {
		diffuse: { value: /*@__PURE__*/ new J(16777215) },
		opacity: { value: 1 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new G() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new G() },
		alphaTest: { value: 0 }
	},
	specularmap: {
		specularMap: { value: null },
		specularMapTransform: { value: /*@__PURE__*/ new G() }
	},
	envmap: {
		envMap: { value: null },
		envMapRotation: { value: /*@__PURE__*/ new G() },
		reflectivity: { value: 1 },
		ior: { value: 1.5 },
		refractionRatio: { value: .98 },
		dfgLUT: { value: null }
	},
	aomap: {
		aoMap: { value: null },
		aoMapIntensity: { value: 1 },
		aoMapTransform: { value: /*@__PURE__*/ new G() }
	},
	lightmap: {
		lightMap: { value: null },
		lightMapIntensity: { value: 1 },
		lightMapTransform: { value: /*@__PURE__*/ new G() }
	},
	bumpmap: {
		bumpMap: { value: null },
		bumpMapTransform: { value: /*@__PURE__*/ new G() },
		bumpScale: { value: 1 }
	},
	normalmap: {
		normalMap: { value: null },
		normalMapTransform: { value: /*@__PURE__*/ new G() },
		normalScale: { value: /*@__PURE__*/ new U(1, 1) }
	},
	displacementmap: {
		displacementMap: { value: null },
		displacementMapTransform: { value: /*@__PURE__*/ new G() },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }
	},
	emissivemap: {
		emissiveMap: { value: null },
		emissiveMapTransform: { value: /*@__PURE__*/ new G() }
	},
	metalnessmap: {
		metalnessMap: { value: null },
		metalnessMapTransform: { value: /*@__PURE__*/ new G() }
	},
	roughnessmap: {
		roughnessMap: { value: null },
		roughnessMapTransform: { value: /*@__PURE__*/ new G() }
	},
	gradientmap: { gradientMap: { value: null } },
	fog: {
		fogDensity: { value: 25e-5 },
		fogNear: { value: 1 },
		fogFar: { value: 2e3 },
		fogColor: { value: /*@__PURE__*/ new J(16777215) }
	},
	lights: {
		ambientLightColor: { value: [] },
		lightProbe: { value: [] },
		sunLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		sunLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		sunShadowMatrix: { value: [] },
		sunShadowCascade: { value: [] },
		directionalLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		directionalLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		directionalShadowMatrix: { value: [] },
		spotLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				direction: {},
				distance: {},
				coneCos: {},
				penumbraCos: {},
				decay: {}
			}
		},
		spotLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		spotLightMap: { value: [] },
		spotLightMatrix: { value: [] },
		pointLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				decay: {},
				distance: {}
			}
		},
		pointLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
				shadowCameraNear: {},
				shadowCameraFar: {}
			}
		},
		pointShadowMatrix: { value: [] },
		hemisphereLights: {
			value: [],
			properties: {
				direction: {},
				skyColor: {},
				groundColor: {}
			}
		},
		rectAreaLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				width: {},
				height: {}
			}
		},
		ltc_1: { value: null },
		ltc_2: { value: null },
		probesSH: { value: null },
		probesMin: { value: /*@__PURE__*/ new W() },
		probesMax: { value: /*@__PURE__*/ new W() },
		probesResolution: { value: /*@__PURE__*/ new W() }
	},
	points: {
		diffuse: { value: /*@__PURE__*/ new J(16777215) },
		opacity: { value: 1 },
		size: { value: 1 },
		scale: { value: 1 },
		map: { value: null },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new G() },
		alphaTest: { value: 0 },
		uvTransform: { value: /*@__PURE__*/ new G() }
	},
	sprite: {
		diffuse: { value: /*@__PURE__*/ new J(16777215) },
		opacity: { value: 1 },
		center: { value: /*@__PURE__*/ new U(.5, .5) },
		rotation: { value: 0 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new G() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new G() },
		alphaTest: { value: 0 }
	}
}, tc = {
	basic: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.specularmap,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.fog
		]),
		vertexShader: Y.meshbasic_vert,
		fragmentShader: Y.meshbasic_frag
	},
	lambert: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.specularmap,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.fog,
			X.lights,
			{
				emissive: { value: /*@__PURE__*/ new J(0) },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Y.meshlambert_vert,
		fragmentShader: Y.meshlambert_frag
	},
	phong: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.specularmap,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.fog,
			X.lights,
			{
				emissive: { value: /*@__PURE__*/ new J(0) },
				specular: { value: /*@__PURE__*/ new J(1118481) },
				shininess: { value: 30 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Y.meshphong_vert,
		fragmentShader: Y.meshphong_frag
	},
	standard: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.roughnessmap,
			X.metalnessmap,
			X.fog,
			X.lights,
			{
				emissive: { value: /*@__PURE__*/ new J(0) },
				roughness: { value: 1 },
				metalness: { value: 0 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Y.meshphysical_vert,
		fragmentShader: Y.meshphysical_frag
	},
	toon: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.gradientmap,
			X.fog,
			X.lights,
			{ emissive: { value: /*@__PURE__*/ new J(0) } }
		]),
		vertexShader: Y.meshtoon_vert,
		fragmentShader: Y.meshtoon_frag
	},
	matcap: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.fog,
			{ matcap: { value: null } }
		]),
		vertexShader: Y.meshmatcap_vert,
		fragmentShader: Y.meshmatcap_frag
	},
	points: {
		uniforms: /*@__PURE__*/ to([X.points, X.fog]),
		vertexShader: Y.points_vert,
		fragmentShader: Y.points_frag
	},
	dashed: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.fog,
			{
				scale: { value: 1 },
				dashSize: { value: 1 },
				totalSize: { value: 2 }
			}
		]),
		vertexShader: Y.linedashed_vert,
		fragmentShader: Y.linedashed_frag
	},
	depth: {
		uniforms: /*@__PURE__*/ to([X.common, X.displacementmap]),
		vertexShader: Y.depth_vert,
		fragmentShader: Y.depth_frag
	},
	normal: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			{ opacity: { value: 1 } }
		]),
		vertexShader: Y.meshnormal_vert,
		fragmentShader: Y.meshnormal_frag
	},
	sprite: {
		uniforms: /*@__PURE__*/ to([X.sprite, X.fog]),
		vertexShader: Y.sprite_vert,
		fragmentShader: Y.sprite_frag
	},
	background: {
		uniforms: {
			uvTransform: { value: /*@__PURE__*/ new G() },
			t2D: { value: null },
			backgroundIntensity: { value: 1 }
		},
		vertexShader: Y.background_vert,
		fragmentShader: Y.background_frag
	},
	backgroundCube: {
		uniforms: {
			envMap: { value: null },
			backgroundBlurriness: { value: 0 },
			backgroundIntensity: { value: 1 },
			backgroundRotation: { value: /*@__PURE__*/ new G() }
		},
		vertexShader: Y.backgroundCube_vert,
		fragmentShader: Y.backgroundCube_frag
	},
	cube: {
		uniforms: {
			tCube: { value: null },
			tFlip: { value: -1 },
			opacity: { value: 1 }
		},
		vertexShader: Y.cube_vert,
		fragmentShader: Y.cube_frag
	},
	equirect: {
		uniforms: { tEquirect: { value: null } },
		vertexShader: Y.equirect_vert,
		fragmentShader: Y.equirect_frag
	},
	distance: {
		uniforms: /*@__PURE__*/ to([
			X.common,
			X.displacementmap,
			{
				referencePosition: { value: /*@__PURE__*/ new W() },
				nearDistance: { value: 1 },
				farDistance: { value: 1e3 }
			}
		]),
		vertexShader: Y.distance_vert,
		fragmentShader: Y.distance_frag
	},
	shadow: {
		uniforms: /*@__PURE__*/ to([
			X.lights,
			X.fog,
			{
				color: { value: /*@__PURE__*/ new J(0) },
				opacity: { value: 1 }
			}
		]),
		vertexShader: Y.shadow_vert,
		fragmentShader: Y.shadow_frag
	}
};
tc.physical = {
	uniforms: /*@__PURE__*/ to([tc.standard.uniforms, {
		clearcoat: { value: 0 },
		clearcoatMap: { value: null },
		clearcoatMapTransform: { value: /*@__PURE__*/ new G() },
		clearcoatNormalMap: { value: null },
		clearcoatNormalMapTransform: { value: /*@__PURE__*/ new G() },
		clearcoatNormalScale: { value: /*@__PURE__*/ new U(1, 1) },
		clearcoatRoughness: { value: 0 },
		clearcoatRoughnessMap: { value: null },
		clearcoatRoughnessMapTransform: { value: /*@__PURE__*/ new G() },
		dispersion: { value: 0 },
		retroreflectivity: { value: 0 },
		iridescence: { value: 0 },
		iridescenceMap: { value: null },
		iridescenceMapTransform: { value: /*@__PURE__*/ new G() },
		iridescenceIOR: { value: 1.3 },
		iridescenceThicknessMinimum: { value: 100 },
		iridescenceThicknessMaximum: { value: 400 },
		iridescenceThicknessMap: { value: null },
		iridescenceThicknessMapTransform: { value: /*@__PURE__*/ new G() },
		sheen: { value: 0 },
		sheenColor: { value: /*@__PURE__*/ new J(0) },
		sheenColorMap: { value: null },
		sheenColorMapTransform: { value: /*@__PURE__*/ new G() },
		sheenRoughness: { value: 1 },
		sheenRoughnessMap: { value: null },
		sheenRoughnessMapTransform: { value: /*@__PURE__*/ new G() },
		transmission: { value: 0 },
		transmissionMap: { value: null },
		transmissionMapTransform: { value: /*@__PURE__*/ new G() },
		transmissionSamplerSize: { value: /*@__PURE__*/ new U() },
		transmissionSamplerMap: { value: null },
		thickness: { value: 0 },
		thicknessMap: { value: null },
		thicknessMapTransform: { value: /*@__PURE__*/ new G() },
		attenuationDistance: { value: 0 },
		attenuationColor: { value: /*@__PURE__*/ new J(0) },
		specularColor: { value: /*@__PURE__*/ new J(1, 1, 1) },
		specularColorMap: { value: null },
		specularColorMapTransform: { value: /*@__PURE__*/ new G() },
		specularIntensity: { value: 1 },
		specularIntensityMap: { value: null },
		specularIntensityMapTransform: { value: /*@__PURE__*/ new G() },
		anisotropyVector: { value: /*@__PURE__*/ new U() },
		anisotropyMap: { value: null },
		anisotropyMapTransform: { value: /*@__PURE__*/ new G() }
	}]),
	vertexShader: Y.meshphysical_vert,
	fragmentShader: Y.meshphysical_frag
};
var nc = {
	r: 0,
	b: 0,
	g: 0
}, rc = /*@__PURE__*/ new q(), ic = /*@__PURE__*/ new G();
ic.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function ac(e, t, n, r, i, a) {
	let o = new J(0), s = i === !0 ? 0 : 1, c, l, u = null, d = 0, f = null;
	function p(e) {
		let n = e.isScene === !0 ? e.background : null;
		if (n && n.isTexture) {
			let r = e.backgroundBlurriness > 0;
			n = t.get(n, r);
		}
		return n;
	}
	function m(t) {
		let r = !1, i = p(t);
		i === null ? g(o, s) : i && i.isColor && (g(i, 1), r = !0);
		let c = e.xr.getEnvironmentBlendMode();
		c === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : c === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (e.autoClear || r) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil));
	}
	function h(t, n) {
		let i = p(n);
		i && (i.isCubeTexture || i.mapping === 306) ? (l === void 0 && (l = new ti(new wa(1, 1, 1), new co({
			name: "BackgroundCubeMaterial",
			uniforms: eo(tc.backgroundCube.uniforms),
			vertexShader: tc.backgroundCube.vertexShader,
			fragmentShader: tc.backgroundCube.fragmentShader,
			side: 1,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), l.geometry.deleteAttribute("normal"), l.geometry.deleteAttribute("uv"), l.onBeforeRender = function(e, t, n) {
			this.matrixWorld.copyPosition(n.matrixWorld);
		}, Object.defineProperty(l.material, "envMap", { get: function() {
			return this.uniforms.envMap.value;
		} }), r.update(l)), l.material.uniforms.envMap.value = i, l.material.uniforms.backgroundBlurriness.value = n.backgroundBlurriness, l.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, l.material.uniforms.backgroundRotation.value.setFromMatrix4(rc.makeRotationFromEuler(n.backgroundRotation)).transpose(), i.isCubeTexture && i.isRenderTargetTexture === !1 && l.material.uniforms.backgroundRotation.value.premultiply(ic), l.material.toneMapped = K.getTransfer(i.colorSpace) !== Ue, (u !== i || d !== i.version || f !== e.toneMapping) && (l.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), l.layers.enableAll(), t.unshift(l, l.geometry, l.material, 0, 0, null)) : i && i.isTexture && (c === void 0 && (c = new ti(new Qa(2, 2), new co({
			name: "BackgroundMaterial",
			uniforms: eo(tc.background.uniforms),
			vertexShader: tc.background.vertexShader,
			fragmentShader: tc.background.fragmentShader,
			side: 0,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
			return this.uniforms.t2D.value;
		} }), r.update(c)), c.material.uniforms.t2D.value = i, c.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, c.material.toneMapped = K.getTransfer(i.colorSpace) !== Ue, i.matrixAutoUpdate === !0 && i.updateMatrix(), c.material.uniforms.uvTransform.value.copy(i.matrix), (u !== i || d !== i.version || f !== e.toneMapping) && (c.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), c.layers.enableAll(), t.unshift(c, c.geometry, c.material, 0, 0, null));
	}
	function g(t, r) {
		t.getRGB(nc, io(e)), n.buffers.color.setClear(nc.r, nc.g, nc.b, r, a);
	}
	function _() {
		l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
	}
	return {
		getClearColor: function() {
			return o;
		},
		setClearColor: function(e, t = 1) {
			o.set(e), s = t, g(o, s);
		},
		getClearAlpha: function() {
			return s;
		},
		setClearAlpha: function(e) {
			s = e, g(o, s);
		},
		render: m,
		addToRenderList: h,
		dispose: _
	};
}
function oc(e, t) {
	let n = e.getParameter(e.MAX_VERTEX_ATTRIBS), r = {}, i = f(null), a = i, o = !1;
	function s(n, r, i, s, c) {
		let u = !1, f = d(n, s, i, r);
		a !== f && (a = f, l(a.object)), u = p(n, s, i, c), u && m(n, s, i, c), c !== null && t.update(c, e.ELEMENT_ARRAY_BUFFER), (u || o) && (o = !1, b(n, r, i, s), c !== null && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(c).buffer));
	}
	function c() {
		return e.createVertexArray();
	}
	function l(t) {
		return e.bindVertexArray(t);
	}
	function u(t) {
		return e.deleteVertexArray(t);
	}
	function d(e, t, n, i) {
		let a = i.wireframe === !0, o = r[t.id];
		o === void 0 && (o = {}, r[t.id] = o);
		let s = e.isInstancedMesh === !0 ? e.id : 0, l = o[s];
		l === void 0 && (l = {}, o[s] = l);
		let u = l[n.id];
		u === void 0 && (u = {}, l[n.id] = u);
		let d = u[a];
		return d === void 0 && (d = f(c()), u[a] = d), d;
	}
	function f(e) {
		let t = [], r = [], i = [];
		for (let e = 0; e < n; e++) t[e] = 0, r[e] = 0, i[e] = 0;
		return {
			geometry: null,
			program: null,
			wireframe: !1,
			newAttributes: t,
			enabledAttributes: r,
			attributeDivisors: i,
			object: e,
			attributes: {},
			index: null
		};
	}
	function p(e, t, n, r) {
		let i = a.attributes, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = i[t], r = o[t];
			if (r === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (r = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (r = e.instanceColor)), n === void 0 || n.attribute !== r || r && n.data !== r.data) return !0;
			s++;
		}
		return a.attributesNum !== s || a.index !== r;
	}
	function m(e, t, n, r) {
		let i = {}, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = o[t];
			n === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (n = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (n = e.instanceColor));
			let r = {};
			r.attribute = n, n && n.data && (r.data = n.data), i[t] = r, s++;
		}
		a.attributes = i, a.attributesNum = s, a.index = r;
	}
	function h() {
		let e = a.newAttributes;
		for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
	}
	function g(e) {
		_(e, 0);
	}
	function _(t, n) {
		let r = a.newAttributes, i = a.enabledAttributes, o = a.attributeDivisors;
		r[t] = 1, i[t] === 0 && (e.enableVertexAttribArray(t), i[t] = 1), o[t] !== n && (e.vertexAttribDivisor(t, n), o[t] = n);
	}
	function v() {
		let t = a.newAttributes, n = a.enabledAttributes;
		for (let r = 0, i = n.length; r < i; r++) n[r] !== t[r] && (e.disableVertexAttribArray(r), n[r] = 0);
	}
	function y(t, n, r, i, a, o, s) {
		s === !0 ? e.vertexAttribIPointer(t, n, r, a, o) : e.vertexAttribPointer(t, n, r, i, a, o);
	}
	function b(n, r, i, a) {
		h();
		let o = a.attributes, s = i.getAttributes(), c = r.defaultAttributeValues;
		for (let r in s) {
			let i = s[r];
			if (i.location >= 0) {
				let s = o[r];
				if (s === void 0 && (r === "instanceMatrix" && n.instanceMatrix && (s = n.instanceMatrix), r === "instanceColor" && n.instanceColor && (s = n.instanceColor)), s !== void 0) {
					let r = s.normalized, o = s.itemSize, c = t.get(s);
					if (c === void 0) continue;
					let l = c.buffer, u = c.type, d = c.bytesPerElement, f = u === e.INT || u === e.UNSIGNED_INT || s.gpuType === 1013;
					if (s.isInterleavedBufferAttribute) {
						let t = s.data, c = t.stride, p = s.offset;
						if (t.isInstancedInterleavedBuffer) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, t.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = t.meshPerAttribute * t.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, c * d, (p + o / i.locationSize * e) * d, f);
					} else {
						if (s.isInstancedBufferAttribute) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, s.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = s.meshPerAttribute * s.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, o * d, o / i.locationSize * e * d, f);
					}
				} else if (c !== void 0) {
					let t = c[r];
					if (t !== void 0) switch (t.length) {
						case 2:
							e.vertexAttrib2fv(i.location, t);
							break;
						case 3:
							e.vertexAttrib3fv(i.location, t);
							break;
						case 4:
							e.vertexAttrib4fv(i.location, t);
							break;
						default: e.vertexAttrib1fv(i.location, t);
					}
				}
			}
		}
		v();
	}
	function x() {
		T();
		for (let e in r) {
			let t = r[e];
			for (let e in t) {
				let n = t[e];
				for (let e in n) {
					let t = n[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete n[e];
				}
			}
			delete r[e];
		}
	}
	function S(e) {
		if (r[e.id] === void 0) return;
		let t = r[e.id];
		for (let e in t) {
			let n = t[e];
			for (let e in n) {
				let t = n[e];
				for (let e in t) u(t[e].object), delete t[e];
				delete n[e];
			}
		}
		delete r[e.id];
	}
	function C(e) {
		for (let t in r) {
			let n = r[t];
			for (let t in n) {
				let r = n[t];
				if (r[e.id] === void 0) continue;
				let i = r[e.id];
				for (let e in i) u(i[e].object), delete i[e];
				delete r[e.id];
			}
		}
	}
	function w(e) {
		for (let t in r) {
			let n = r[t], i = e.isInstancedMesh === !0 ? e.id : 0, a = n[i];
			if (a !== void 0) {
				for (let e in a) {
					let t = a[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete a[e];
				}
				delete n[i], Object.keys(n).length === 0 && delete r[t];
			}
		}
	}
	function T() {
		E(), o = !0, a !== i && (a = i, l(a.object));
	}
	function E() {
		i.geometry = null, i.program = null, i.wireframe = !1;
	}
	return {
		setup: s,
		reset: T,
		resetDefaultState: E,
		dispose: x,
		releaseStatesOfGeometry: S,
		releaseStatesOfObject: w,
		releaseStatesOfProgram: C,
		initAttributes: h,
		enableAttribute: g,
		disableUnusedAttributes: v
	};
}
function sc(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	function a(t, i) {
		e.drawArrays(r, t, i), n.update(i, r, 1);
	}
	function o(t, i, a) {
		a !== 0 && (e.drawArraysInstanced(r, t, i, a), n.update(i, r, a));
	}
	function s(e, i, a) {
		if (a === 0) return;
		t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r, e, 0, i, 0, a);
		let o = 0;
		for (let e = 0; e < a; e++) o += i[e];
		n.update(o, r, 1);
	}
	this.setMode = i, this.render = a, this.renderInstances = o, this.renderMultiDraw = s;
}
function cc(e, t, n, r) {
	let i;
	function a() {
		if (i !== void 0) return i;
		if (t.has("EXT_texture_filter_anisotropic") === !0) {
			let n = t.get("EXT_texture_filter_anisotropic");
			i = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		} else i = 0;
		return i;
	}
	function o(t) {
		return t === 1023 || r.convert(t) === e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT);
	}
	function s(n) {
		let i = n === 1016 && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
		return !(n !== 1009 && n !== 1015 && !i && r.convert(n) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE));
	}
	function c(t) {
		if (t === "highp") {
			if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
			t = "mediump";
		}
		return t === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
	}
	let l = n.precision === void 0 ? "highp" : n.precision, u = c(l);
	u !== l && (B("WebGLRenderer:", l, "not supported, using", u, "instead."), l = u);
	let d = n.logarithmicDepthBuffer === !0, f = n.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
	n.reversedDepthBuffer === !0 && f === !1 && B("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
	let p = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), m = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), h = e.getParameter(e.MAX_TEXTURE_SIZE), g = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), _ = e.getParameter(e.MAX_VERTEX_ATTRIBS), v = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), y = e.getParameter(e.MAX_VARYING_VECTORS), b = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), x = e.getParameter(e.MAX_SAMPLES), S = e.getParameter(e.SAMPLES);
	return {
		isWebGL2: !0,
		getMaxAnisotropy: a,
		getMaxPrecision: c,
		textureFormatReadable: o,
		textureTypeReadable: s,
		precision: l,
		logarithmicDepthBuffer: d,
		reversedDepthBuffer: f,
		maxTextures: p,
		maxVertexTextures: m,
		maxTextureSize: h,
		maxCubemapSize: g,
		maxAttributes: _,
		maxVertexUniforms: v,
		maxVaryings: y,
		maxFragmentUniforms: b,
		maxSamples: x,
		samples: S
	};
}
function lc(e) {
	let t = this, n = null, r = 0, i = !1, a = !1, o = new Fr(), s = new G(), c = {
		value: null,
		needsUpdate: !1
	};
	this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e, t) {
		let n = e.length !== 0 || t || r !== 0 || i;
		return i = t, r = e.length, n;
	}, this.beginShadows = function() {
		a = !0, u(null);
	}, this.endShadows = function() {
		a = !1;
	}, this.setGlobalState = function(e, t) {
		n = u(e, t, 0);
	}, this.setState = function(t, o, s) {
		let d = t.clippingPlanes, f = t.clipIntersection, p = t.clipShadows, m = e.get(t);
		if (!i || d === null || d.length === 0 || a && !p) a ? u(null) : l();
		else {
			let e = a ? 0 : r, t = e * 4, i = m.clippingState || null;
			c.value = i, i = u(d, o, t, s);
			for (let e = 0; e !== t; ++e) i[e] = n[e];
			m.clippingState = i, this.numIntersection = f ? this.numPlanes : 0, this.numPlanes += e;
		}
	};
	function l() {
		c.value !== n && (c.value = n, c.needsUpdate = r > 0), t.numPlanes = r, t.numIntersection = 0;
	}
	function u(e, n, r, i) {
		let a = e === null ? 0 : e.length, l = null;
		if (a !== 0) {
			if (l = c.value, i !== !0 || l === null) {
				let t = r + a * 4, i = n.matrixWorldInverse;
				s.getNormalMatrix(i), (l === null || l.length < t) && (l = new Float32Array(t));
				for (let t = 0, n = r; t !== a; ++t, n += 4) o.copy(e[t]).applyMatrix4(i, s), o.normal.toArray(l, n), l[n + 3] = o.constant;
			}
			c.value = l, c.needsUpdate = !0;
		}
		return t.numPlanes = a, t.numIntersection = 0, l;
	}
}
var uc = 4, dc = 6, fc = 20, pc = 256, mc = /*@__PURE__*/ new hs(), hc = /*@__PURE__*/ new J(), gc = null, _c = 0, vc = 0, yc = !1, bc = /*@__PURE__*/ new W(), xc = /*@__PURE__*/ new W(), Sc = class {
	constructor(e) {
		this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
	}
	fromScene(e, t = 0, n = .1, r = 100, i = {}) {
		let { size: a = 256, position: o = bc } = i;
		gc = this._renderer.getRenderTarget(), _c = this._renderer.getActiveCubeFace(), vc = this._renderer.getActiveMipmapLevel(), yc = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
		let s = this._allocateTargets();
		return s.depthBuffer = !0, this._sceneToCubeUV(e, n, r, s, o), t > 0 && this._blur(s, 0, 0, t), this._applyPMREM(s), this._cleanup(s), s;
	}
	fromEquirectangular(e, t = null) {
		return this._fromTexture(e, t);
	}
	fromCubemap(e, t = null) {
		return this._fromTexture(e, t);
	}
	compileCubemapShader() {
		this._cubemapMaterial === null && (this._cubemapMaterial = kc(), this._compileMaterial(this._cubemapMaterial));
	}
	compileEquirectangularShader() {
		this._equirectMaterial === null && (this._equirectMaterial = Oc(), this._compileMaterial(this._equirectMaterial));
	}
	dispose() {
		this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
	}
	_setSize(e) {
		this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = 2 ** this._lodMax;
	}
	_dispose() {
		this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
		for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
	}
	_cleanup(e) {
		this._renderer.setRenderTarget(gc, _c, vc), this._renderer.xr.enabled = yc, e.scissorTest = !1, Tc(e, 0, 0, e.width, e.height);
	}
	_fromTexture(e, t) {
		e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), gc = this._renderer.getRenderTarget(), _c = this._renderer.getActiveCubeFace(), vc = this._renderer.getActiveMipmapLevel(), yc = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
		let n = t || this._allocateTargets();
		return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
	}
	_allocateTargets() {
		let e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
			magFilter: l,
			minFilter: l,
			generateMipmaps: !1,
			type: y,
			format: D,
			colorSpace: Ve,
			depthBuffer: !1
		}, r = wc(e, t, n);
		if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
			this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = wc(e, t, n);
			let { _lodMax: r } = this;
			({lodMeshes: this._lodMeshes, sizeLods: this._sizeLods} = Cc(r)), this._blurMaterial = Dc(r, e, t), this._ggxMaterial = Ec(r, e, t);
		}
		return r;
	}
	_compileMaterial(e) {
		let t = new ti(new Or(), e);
		this._renderer.compile(t, mc);
	}
	_sceneToCubeUV(e, t, n, r, i) {
		let a = new us(90, 1, t, n), o = [
			1,
			-1,
			1,
			1,
			1,
			1
		], s = [
			1,
			1,
			1,
			-1,
			-1,
			-1
		], c = this._renderer, l = c.autoClear, u = c.toneMapping;
		c.getClearColor(hc), c.toneMapping = 0, c.autoClear = !1, c.state.buffers.depth.getReversed() && (c.setRenderTarget(r), c.clearDepth(), c.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new ti(new wa(), new Ur({
			name: "PMREM.Background",
			side: 1,
			depthWrite: !1,
			depthTest: !1
		})));
		let d = this._backgroundBox, f = d.material, p = !1, m = e.background;
		m ? m.isColor && (f.color.copy(m), e.background = null, p = !0) : (f.color.copy(hc), p = !0);
		for (let t = 0; t < 6; t++) {
			let n = t % 3;
			n === 0 ? (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x + s[t], i.y, i.z)) : n === 1 ? (a.up.set(0, 0, o[t]), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y + s[t], i.z)) : (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y, i.z + s[t]));
			let l = this._cubeSize;
			Tc(r, n * l, t > 2 ? l : 0, l, l), c.setRenderTarget(r), p && c.render(d, a), c.render(e, a);
		}
		c.toneMapping = u, c.autoClear = l, e.background = m;
	}
	_textureToCubeUV(e, t) {
		let n = this._renderer, r = e.mapping === 301 || e.mapping === 302;
		r ? (this._cubemapMaterial === null && (this._cubemapMaterial = kc()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Oc());
		let i = r ? this._cubemapMaterial : this._equirectMaterial, a = this._lodMeshes[0];
		a.material = i;
		let o = i.uniforms;
		o.envMap.value = e;
		let s = this._cubeSize;
		Tc(t, 0, 0, 3 * s, 2 * s), n.setRenderTarget(t), n.render(a, mc);
	}
	_applyPMREM(e) {
		let t = this._renderer, n = t.autoClear;
		t.autoClear = !1;
		let r = this._lodMeshes.length;
		for (let t = 1; t < r; t++) this._applyGGXFilter(e, t - 1, t);
		t.autoClear = n;
	}
	_applyGGXFilter(e, t, n) {
		let r = this._renderer, i = this._pingPongRenderTarget, a = this._ggxMaterial, o = this._lodMeshes[n];
		o.material = a;
		let s = a.uniforms, c = n / (this._lodMeshes.length - 1), l = t / (this._lodMeshes.length - 1), u = Math.sqrt(c * c - l * l) * (c * 1.25), { _lodMax: d } = this, f = this._sizeLods[n], p = 3 * f * (n > d - uc ? n - d + uc : 0), m = 4 * (this._cubeSize - f);
		s.envMap.value = e.texture, s.roughness.value = u, s.mipInt.value = d - t, Tc(i, p, m, 3 * f, 2 * f), r.setRenderTarget(i), r.render(o, mc), s.envMap.value = i.texture, s.roughness.value = 0, s.mipInt.value = d - n, Tc(e, p, m, 3 * f, 2 * f), r.setRenderTarget(e), r.render(o, mc);
	}
	_blur(e, t, n, r) {
		let i = this._pingPongRenderTarget, a = Math.min(r, Math.PI) / Math.SQRT2;
		this._blurPass(e, i, t, n, a), this._blurPass(i, e, n, n, a);
	}
	_blurPass(e, t, n, r, i) {
		let a = this._renderer, o = this._blurMaterial, s = this._lodMeshes[r];
		s.material = o;
		let c = o.uniforms;
		c.envMap.value = e.texture, c.sigma.value = i, c.mipInt.value = this._lodMax - n;
		let l = this._sizeLods[r];
		Tc(t, 3 * l * (r > this._lodMax - uc ? r - this._lodMax + uc : 0), 4 * (this._cubeSize - l), 3 * l, 2 * l), a.setRenderTarget(t), a.render(s, mc);
	}
};
function Cc(e) {
	let t = [], n = [], r = e, i = e - uc + 1 + dc;
	for (let e = 0; e < i; e++) {
		let e = 2 ** r;
		t.push(e);
		let i = 1 / (e - 2), a = -i, o = 1 + i, s = [
			a,
			a,
			o,
			a,
			o,
			o,
			a,
			a,
			o,
			o,
			a,
			o
		], c = /* @__PURE__ */ new Float32Array(108), l = /* @__PURE__ */ new Float32Array(108);
		for (let e = 0; e < 6; e++) {
			let t = e % 3 * 2 / 3 - 1, n = e > 2 ? 0 : -1, r = [
				t,
				n,
				0,
				t + 2 / 3,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n + 1,
				0
			];
			c.set(r, 18 * e);
			for (let t = 0; t < 6; t++) {
				let n = s[t * 2] * 2 - 1, r = s[t * 2 + 1] * 2 - 1;
				e === 0 ? xc.set(1, r, n) : e === 1 ? xc.set(-n, 1, -r) : e === 2 ? xc.set(-n, r, 1) : e === 3 ? xc.set(-1, r, -n) : e === 4 ? xc.set(-n, -1, r) : xc.set(n, r, -1), xc.toArray(l, (e * 6 + t) * 3);
			}
		}
		let u = new Or();
		u.setAttribute("position", new pr(c, 3)), u.setAttribute("outputDirection", new pr(l, 3)), n.push(new ti(u, null)), r > uc && r--;
	}
	return {
		lodMeshes: n,
		sizeLods: t
	};
}
function wc(e, t, n) {
	let r = new Yt(e, t, n);
	return r.texture.mapping = 306, r.texture.name = "PMREM.cubeUv", r.scissorTest = !0, r;
}
function Tc(e, t, n, r, i) {
	e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i);
}
function Ec(e, t, n) {
	return new co({
		name: "PMREMGGXConvolution",
		defines: {
			GGX_SAMPLES: pc,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			roughness: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: Ac(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float roughness;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n\n			// Van der Corput radical inverse\n			float radicalInverse_VdC(uint bits) {\n				bits = (bits << 16u) | (bits >> 16u);\n				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\n				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\n				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\n				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\n				return float(bits) * 2.3283064365386963e-10; // / 0x100000000\n			}\n\n			// Hammersley sequence\n			vec2 hammersley(uint i, uint N) {\n				return vec2(float(i) / float(N), radicalInverse_VdC(i));\n			}\n\n			// GGX VNDF importance sampling (Eric Heitz 2018)\n			// \"Sampling the GGX Distribution of Visible Normals\"\n			// https://jcgt.org/published/0007/04/01/\n			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {\n				float alpha = roughness * roughness;\n\n				// Section 4.1: Orthonormal basis\n				vec3 T1 = vec3(1.0, 0.0, 0.0);\n				vec3 T2 = cross(V, T1);\n\n				// Section 4.2: Parameterization of projected area\n				float r = sqrt(Xi.x);\n				float phi = 2.0 * PI * Xi.y;\n				float t1 = r * cos(phi);\n				float t2 = r * sin(phi);\n				float s = 0.5 * (1.0 + V.z);\n				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;\n\n				// Section 4.3: Reprojection onto hemisphere\n				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;\n\n				// Section 3.4: Transform back to ellipsoid configuration\n				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));\n			}\n\n			void main() {\n				vec3 N = normalize(vOutputDirection);\n				vec3 V = N; // Assume view direction equals normal for pre-filtering\n\n				vec3 prefilteredColor = vec3(0.0);\n				float totalWeight = 0.0;\n\n				// For very low roughness, just sample the environment directly\n				if (roughness < 0.001) {\n					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);\n					return;\n				}\n\n				// Tangent space basis for VNDF sampling\n				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);\n				vec3 tangent = normalize(cross(up, N));\n				vec3 bitangent = cross(N, tangent);\n\n				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {\n					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));\n\n					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)\n					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);\n\n					// Transform H back to world space\n					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);\n					vec3 L = normalize(2.0 * dot(V, H) * H - V);\n\n					float NdotL = max(dot(N, L), 0.0);\n\n					if(NdotL > 0.0) {\n						// Sample environment at fixed mip level\n						// VNDF importance sampling handles the distribution filtering\n						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);\n\n						// Weight by NdotL for the split-sum approximation\n						// VNDF PDF naturally accounts for the visible microfacet distribution\n						prefilteredColor += sampleColor * NdotL;\n						totalWeight += NdotL;\n					}\n				}\n\n				if (totalWeight > 0.0) {\n					prefilteredColor = prefilteredColor / totalWeight;\n				}\n\n				gl_FragColor = vec4(prefilteredColor, 1.0);\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Dc(e, t, n) {
	return new co({
		name: "SphericalGaussianBlur",
		defines: {
			SAMPLES: fc,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			sigma: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: Ac(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float sigma;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n			#define GOLDEN_ANGLE 2.39996322973\n\n			void main() {\n\n				if ( sigma == 0.0 ) {\n\n					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );\n					return;\n\n				}\n\n				vec3 outputDirection = normalize( vOutputDirection );\n\n				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );\n				vec3 tangent = normalize( cross( up, outputDirection ) );\n				vec3 bitangent = cross( outputDirection, tangent );\n\n				// Truncate the kernel at three standard deviations or at the antipode.\n				float thetaMax = min( 3.0 * sigma, PI );\n				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );\n\n				vec3 accumColor = vec3( 0.0 );\n				float accumWeight = 0.0;\n\n				for ( int i = 0; i < SAMPLES; i ++ ) {\n\n					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.\n					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );\n					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );\n					float phi = float( i ) * GOLDEN_ANGLE;\n\n					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;\n					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;\n\n					// Correct the planar sample density to solid angle.\n					float weight = sin( theta ) / theta;\n\n					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );\n					accumWeight += weight;\n\n				}\n\n				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Oc() {
	return new co({
		name: "EquirectangularToCubeUV",
		uniforms: { envMap: { value: null } },
		vertexShader: Ac(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n\n			#include <common>\n\n			void main() {\n\n				vec3 outputDirection = normalize( vOutputDirection );\n				vec2 uv = equirectUv( outputDirection );\n\n				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function kc() {
	return new co({
		name: "CubemapToCubeUV",
		uniforms: {
			envMap: { value: null },
			flipEnvMap: { value: -1 }
		},
		vertexShader: Ac(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			uniform float flipEnvMap;\n\n			varying vec3 vOutputDirection;\n\n			uniform samplerCube envMap;\n\n			void main() {\n\n				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Ac() {
	return "\n\n		precision mediump float;\n		precision mediump int;\n\n		attribute vec3 outputDirection;\n\n		varying vec3 vOutputDirection;\n\n		void main() {\n\n			vOutputDirection = outputDirection;\n			gl_Position = vec4( position, 1.0 );\n\n		}\n	";
}
var jc = class extends Yt {
	constructor(e = 1, t = {}) {
		super(e, e, t), this.isWebGLCubeRenderTarget = !0;
		let n = {
			width: e,
			height: e,
			depth: 1
		}, r = [
			n,
			n,
			n,
			n,
			n,
			n
		];
		this.texture = new ba(r), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
	}
	fromEquirectangularTexture(e, t) {
		this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
		let n = {
			uniforms: { tEquirect: { value: null } },
			vertexShader: "\n\n				varying vec3 vWorldDirection;\n\n				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n				}\n\n				void main() {\n\n					vWorldDirection = transformDirection( position, modelMatrix );\n\n					#include <begin_vertex>\n					#include <project_vertex>\n\n				}\n			",
			fragmentShader: "\n\n				uniform sampler2D tEquirect;\n\n				varying vec3 vWorldDirection;\n\n				#include <common>\n\n				void main() {\n\n					vec3 direction = normalize( vWorldDirection );\n\n					vec2 sampleUV = equirectUv( direction );\n\n					gl_FragColor = texture2D( tEquirect, sampleUV );\n\n				}\n			"
		}, r = new wa(5, 5, 5), i = new co({
			name: "CubemapFromEquirect",
			uniforms: eo(n.uniforms),
			vertexShader: n.vertexShader,
			fragmentShader: n.fragmentShader,
			side: 1,
			blending: 0
		});
		i.uniforms.tEquirect.value = t;
		let a = new ti(r, i), o = t.minFilter;
		return t.minFilter === 1008 && (t.minFilter = l), new Cs(1, 10, this).update(e, a), t.minFilter = o, a.geometry.dispose(), a.material.dispose(), this;
	}
	clear(e, t = !0, n = !0, r = !0) {
		let i = e.getRenderTarget();
		for (let i = 0; i < 6; i++) e.setRenderTarget(this, i), e.clear(t, n, r);
		e.setRenderTarget(i);
	}
};
function Mc(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = null;
	function i(e, t = !1) {
		return e == null ? null : t ? o(e) : a(e);
	}
	function a(n) {
		if (n && n.isTexture) {
			let r = n.mapping;
			if (r === 303 || r === 304) {
				if (t.has(n)) {
					let e = t.get(n).texture;
					return s(e, n.mapping);
				}
				{
					let r = n.image;
					if (r && r.height > 0) {
						let i = new jc(r.height);
						return i.fromEquirectangularTexture(e, n), t.set(n, i), n.addEventListener("dispose", l), s(i.texture, n.mapping);
					}
					return null;
				}
			}
		}
		return n;
	}
	function o(t) {
		if (t && t.isTexture) {
			let i = t.mapping, a = i === 303 || i === 304, o = i === 301 || i === 302;
			if (a || o) {
				let i = n.get(t), s = i === void 0 ? 0 : i.texture.pmremVersion;
				if (t.isRenderTargetTexture && t.pmremVersion !== s) return r === null && (r = new Sc(e)), i = a ? r.fromEquirectangular(t, i) : r.fromCubemap(t, i), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), i.texture;
				if (i !== void 0) return i.texture;
				{
					let s = t.image;
					return a && s && s.height > 0 || o && s && c(s) ? (r === null && (r = new Sc(e)), i = a ? r.fromEquirectangular(t) : r.fromCubemap(t), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), t.addEventListener("dispose", u), i.texture) : null;
				}
			}
		}
		return t;
	}
	function s(e, t) {
		return t === 303 ? e.mapping = 301 : t === 304 && (e.mapping = 302), e;
	}
	function c(e) {
		let t = 0;
		for (let n = 0; n < 6; n++) e[n] !== void 0 && t++;
		return t === 6;
	}
	function l(e) {
		let n = e.target;
		n.removeEventListener("dispose", l);
		let r = t.get(n);
		r !== void 0 && (t.delete(n), r.dispose());
	}
	function u(e) {
		let t = e.target;
		t.removeEventListener("dispose", u);
		let r = n.get(t);
		r !== void 0 && (n.delete(t), r.dispose());
	}
	function d() {
		t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r !== null && (r.dispose(), r = null);
	}
	return {
		get: i,
		dispose: d
	};
}
function Nc(e) {
	let t = {};
	function n(n) {
		if (t[n] !== void 0) return t[n];
		let r = e.getExtension(n);
		return t[n] = r, r;
	}
	return {
		has: function(e) {
			return n(e) !== null;
		},
		init: function() {
			n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance"), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture"), n("WEBGL_render_shared_exponent");
		},
		get: function(e) {
			let t = n(e);
			return t === null && et("WebGLRenderer: " + e + " extension not supported."), t;
		}
	};
}
function Pc(e, t, n, r) {
	let i = {}, a = /* @__PURE__ */ new WeakMap();
	function o(e) {
		let s = e.target;
		s.index !== null && t.remove(s.index);
		for (let e in s.attributes) t.remove(s.attributes[e]);
		s.removeEventListener("dispose", o), delete i[s.id];
		let c = a.get(s);
		c && (t.remove(c), a.delete(s)), r.releaseStatesOfGeometry(s), s.isInstancedBufferGeometry === !0 && delete s._maxInstanceCount, n.memory.geometries--;
	}
	function s(e, t) {
		return i[t.id] === !0 || (t.addEventListener("dispose", o), i[t.id] = !0, n.memory.geometries++), t;
	}
	function c(n) {
		let r = n.attributes;
		for (let n in r) t.update(r[n], e.ARRAY_BUFFER);
	}
	function l(e) {
		let n = [], r = e.index, i = e.attributes.position, o = 0;
		if (i === void 0) return;
		if (r !== null) {
			let e = r.array;
			o = r.version;
			for (let t = 0, r = e.length; t < r; t += 3) {
				let r = e[t + 0], i = e[t + 1], a = e[t + 2];
				n.push(r, i, i, a, a, r);
			}
		} else {
			let e = i.array;
			o = i.version;
			for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
				let e = t + 0, r = t + 1, i = t + 2;
				n.push(e, r, r, i, i, e);
			}
		}
		let s = new (i.count >= 65535 ? hr : mr)(n, 1);
		s.version = o;
		let c = a.get(e);
		c && t.remove(c), a.set(e, s);
	}
	function u(e) {
		let t = a.get(e);
		if (t) {
			let n = e.index;
			n !== null && t.version < n.version && l(e);
		} else l(e);
		return a.get(e);
	}
	return {
		get: s,
		update: c,
		getWireframeAttribute: u
	};
}
function Fc(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	let a, o;
	function s(e) {
		a = e.type, o = e.bytesPerElement;
	}
	function c(t, i) {
		e.drawElements(r, i, a, t * o), n.update(i, r, 1);
	}
	function l(t, i, s) {
		s !== 0 && (e.drawElementsInstanced(r, i, a, t * o, s), n.update(i, r, s));
	}
	function u(e, i, o) {
		if (o === 0) return;
		t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r, i, 0, a, e, 0, o);
		let s = 0;
		for (let e = 0; e < o; e++) s += i[e];
		n.update(s, r, 1);
	}
	this.setMode = i, this.setIndex = s, this.render = c, this.renderInstances = l, this.renderMultiDraw = u;
}
function Ic(e) {
	let t = {
		geometries: 0,
		textures: 0
	}, n = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0
	};
	function r(t, r, i) {
		switch (n.calls++, r) {
			case e.TRIANGLES:
				n.triangles += t / 3 * i;
				break;
			case e.LINES:
				n.lines += t / 2 * i;
				break;
			case e.LINE_STRIP:
				n.lines += i * (t - 1);
				break;
			case e.LINE_LOOP:
				n.lines += i * t;
				break;
			case e.POINTS:
				n.points += i * t;
				break;
			default: V("WebGLInfo: Unknown draw mode:", r);
		}
	}
	function i() {
		n.calls = 0, n.triangles = 0, n.points = 0, n.lines = 0;
	}
	return {
		memory: t,
		render: n,
		programs: null,
		autoReset: !0,
		reset: i,
		update: r
	};
}
function Lc(e, t, n) {
	let r = /* @__PURE__ */ new WeakMap(), i = new qt();
	function a(a, o, s) {
		let c = a.morphTargetInfluences, l = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = l === void 0 ? 0 : l.length, d = r.get(o);
		if (d === void 0 || d.count !== u) {
			d !== void 0 && d.texture.dispose();
			let e = o.morphAttributes.position !== void 0, n = o.morphAttributes.normal !== void 0, a = o.morphAttributes.color !== void 0, s = o.morphAttributes.position || [], c = o.morphAttributes.normal || [], l = o.morphAttributes.color || [], f = 0;
			e === !0 && (f = 1), n === !0 && (f = 2), a === !0 && (f = 3);
			let p = o.attributes.position.count * f, m = 1;
			p > t.maxTextureSize && (m = Math.ceil(p / t.maxTextureSize), p = t.maxTextureSize);
			let h = new Float32Array(p * m * 4 * u), g = new Xt(h, p, m, u);
			g.type = v, g.needsUpdate = !0;
			let _ = f * 4;
			for (let t = 0; t < u; t++) {
				let r = s[t], o = c[t], u = l[t], d = p * m * 4 * t;
				for (let t = 0; t < r.count; t++) {
					let s = t * _;
					e === !0 && (i.fromBufferAttribute(r, t), h[d + s + 0] = i.x, h[d + s + 1] = i.y, h[d + s + 2] = i.z, h[d + s + 3] = 0), n === !0 && (i.fromBufferAttribute(o, t), h[d + s + 4] = i.x, h[d + s + 5] = i.y, h[d + s + 6] = i.z, h[d + s + 7] = 0), a === !0 && (i.fromBufferAttribute(u, t), h[d + s + 8] = i.x, h[d + s + 9] = i.y, h[d + s + 10] = i.z, h[d + s + 11] = u.itemSize === 4 ? i.w : 1);
				}
			}
			d = {
				count: u,
				texture: g,
				size: new U(p, m)
			}, r.set(o, d);
			function y() {
				g.dispose(), r.delete(o), o.removeEventListener("dispose", y);
			}
			o.addEventListener("dispose", y);
		}
		if (a.isInstancedMesh === !0 && a.morphTexture !== null) s.getUniforms().setValue(e, "morphTexture", a.morphTexture, n);
		else {
			let t = 0;
			for (let e = 0; e < c.length; e++) t += c[e];
			let n = o.morphTargetsRelative ? 1 : 1 - t;
			s.getUniforms().setValue(e, "morphTargetBaseInfluence", n), s.getUniforms().setValue(e, "morphTargetInfluences", c);
		}
		s.getUniforms().setValue(e, "morphTargetsTexture", d.texture, n), s.getUniforms().setValue(e, "morphTargetsTextureSize", d.size);
	}
	return { update: a };
}
function Rc(e, t, n, r, i) {
	let a = /* @__PURE__ */ new WeakMap();
	function o(r) {
		let o = i.render.frame, s = r.geometry, l = t.get(r, s);
		if (a.get(l) !== o && (t.update(l), a.set(l, o)), r.isInstancedMesh && (r.hasEventListener("dispose", c) === !1 && r.addEventListener("dispose", c), a.get(r) !== o && (n.update(r.instanceMatrix, e.ARRAY_BUFFER), r.instanceColor !== null && n.update(r.instanceColor, e.ARRAY_BUFFER), a.set(r, o))), r.isSkinnedMesh) {
			let e = r.skeleton;
			a.get(e) !== o && (e.update(), a.set(e, o));
		}
		return l;
	}
	function s() {
		a = /* @__PURE__ */ new WeakMap();
	}
	function c(e) {
		let t = e.target;
		t.removeEventListener("dispose", c), r.releaseStatesOfObject(t), n.remove(t.instanceMatrix), t.instanceColor !== null && n.remove(t.instanceColor);
	}
	return {
		update: o,
		dispose: s
	};
}
var zc = {
	1: "LINEAR_TONE_MAPPING",
	2: "REINHARD_TONE_MAPPING",
	3: "CINEON_TONE_MAPPING",
	4: "ACES_FILMIC_TONE_MAPPING",
	6: "AGX_TONE_MAPPING",
	7: "NEUTRAL_TONE_MAPPING",
	5: "CUSTOM_TONE_MAPPING"
};
function Bc(e, t, n, r, i, a) {
	let o = new Yt(t, n, {
		type: e,
		depthBuffer: i,
		stencilBuffer: a,
		samples: r ? 4 : 0,
		storeMultisampledDepthBuffer: !1,
		storeMultisampledStencilBuffer: !1,
		resolveDepthBuffer: !1,
		resolveStencilBuffer: !1
	}), s = null, c = null, l = new Or();
	l.setAttribute("position", new gr([
		-1,
		3,
		0,
		-1,
		-1,
		0,
		3,
		-1,
		0
	], 3)), l.setAttribute("uv", new gr([
		0,
		2,
		0,
		0,
		2,
		0
	], 2));
	let u = new lo({
		uniforms: { tDiffuse: { value: null } },
		vertexShader: "\n			precision highp float;\n\n			uniform mat4 modelViewMatrix;\n			uniform mat4 projectionMatrix;\n\n			attribute vec3 position;\n			attribute vec2 uv;\n\n			varying vec2 vUv;\n\n			void main() {\n				vUv = uv;\n				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n			}",
		fragmentShader: "\n			precision highp float;\n\n			uniform sampler2D tDiffuse;\n\n			varying vec2 vUv;\n\n			#include <tonemapping_pars_fragment>\n			#include <colorspace_pars_fragment>\n\n			void main() {\n				gl_FragColor = texture2D( tDiffuse, vUv );\n\n				#ifdef LINEAR_TONE_MAPPING\n					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n				#elif defined( REINHARD_TONE_MAPPING )\n					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n				#elif defined( CINEON_TONE_MAPPING )\n					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n				#elif defined( ACES_FILMIC_TONE_MAPPING )\n					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n				#elif defined( AGX_TONE_MAPPING )\n					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n				#elif defined( NEUTRAL_TONE_MAPPING )\n					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n				#elif defined( CUSTOM_TONE_MAPPING )\n					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n				#endif\n\n				#ifdef SRGB_TRANSFER\n					gl_FragColor = sRGBTransferOETF( gl_FragColor );\n				#endif\n			}",
		depthTest: !1,
		depthWrite: !1
	}), d = new ti(l, u), f = new hs(-1, 1, 1, -1, 0, 1), p = null, m = null, h = !1, g, _ = null, v = [], b = !1;
	this.setSize = function(e, t) {
		o.setSize(e, t), s !== null && s.setSize(e, t), c !== null && c.setSize(e, t);
		for (let n = 0; n < v.length; n++) {
			let r = v[n];
			r.setSize && r.setSize(e, t);
		}
	}, this.setEffects = function(e) {
		v = e, b = v.length > 0 && v[0].isRenderPass === !0;
		let t = o.width, n = o.height;
		v.length > 0 && s === null && (s = new Yt(t, n, {
			type: y,
			depthBuffer: !1,
			stencilBuffer: !1
		}), c = new Yt(t, n, {
			type: y,
			depthBuffer: !1,
			stencilBuffer: !1
		}));
		for (let e = 0; e < v.length; e++) {
			let r = v[e];
			r.setSize && r.setSize(t, n);
		}
	}, this.begin = function(e, t) {
		if (h || e.toneMapping === 0 && v.length === 0) return !1;
		if (_ = t, t !== null) {
			let e = t.width, n = t.height;
			(o.width !== e || o.height !== n) && this.setSize(e, n);
		}
		return b === !1 && e.setRenderTarget(o), g = e.toneMapping, e.toneMapping = 0, !0;
	}, this.hasRenderPass = function() {
		return b;
	}, this.end = function(e, t) {
		e.toneMapping = g, h = !0;
		let n = o, r = s;
		for (let i = 0; i < v.length; i++) {
			let a = v[i];
			a.enabled !== !1 && (a.render(e, r, n, t), a.needsSwap !== !1 && (n = r, r = r === s ? c : s));
		}
		if (p !== e.outputColorSpace || m !== e.toneMapping) {
			p = e.outputColorSpace, m = e.toneMapping, u.defines = {}, K.getTransfer(p) === "srgb" && (u.defines.SRGB_TRANSFER = "");
			let t = zc[m];
			t && (u.defines[t] = ""), u.needsUpdate = !0;
		}
		u.uniforms.tDiffuse.value = n.texture, e.setRenderTarget(_), e.render(d, f), _ = null, h = !1;
	}, this.isCompositing = function() {
		return h;
	}, this.dispose = function() {
		o.dispose(), s !== null && s.dispose(), c !== null && c.dispose(), l.dispose(), u.dispose();
	};
}
var Vc = /*@__PURE__*/ new Kt(), Hc = /*@__PURE__*/ new xa(1, 1), Uc = /*@__PURE__*/ new Xt(), Wc = /*@__PURE__*/ new Zt(), Gc = /*@__PURE__*/ new ba(), Kc = [], qc = [], Jc = /* @__PURE__ */ new Float32Array(16), Yc = /* @__PURE__ */ new Float32Array(9), Xc = /* @__PURE__ */ new Float32Array(4);
function Zc(e, t, n) {
	let r = e[0];
	if (r <= 0 || r > 0) return e;
	let i = t * n, a = Kc[i];
	if (a === void 0 && (a = new Float32Array(i), Kc[i] = a), t !== 0) {
		r.toArray(a, 0);
		for (let r = 1, i = 0; r !== t; ++r) i += n, e[r].toArray(a, i);
	}
	return a;
}
function Qc(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function $c(e, t) {
	for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function el(e, t) {
	let n = qc[t];
	n === void 0 && (n = new Int32Array(t), qc[t] = n);
	for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
	return n;
}
function tl(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1f(this.addr, t), n[0] = t);
}
function nl(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2f(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (Qc(n, t)) return;
		e.uniform2fv(this.addr, t), $c(n, t);
	}
}
function rl(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3f(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else if (t.r !== void 0) (n[0] !== t.r || n[1] !== t.g || n[2] !== t.b) && (e.uniform3f(this.addr, t.r, t.g, t.b), n[0] = t.r, n[1] = t.g, n[2] = t.b);
	else {
		if (Qc(n, t)) return;
		e.uniform3fv(this.addr, t), $c(n, t);
	}
}
function il(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4f(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (Qc(n, t)) return;
		e.uniform4fv(this.addr, t), $c(n, t);
	}
}
function al(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (Qc(n, t)) return;
		e.uniformMatrix2fv(this.addr, !1, t), $c(n, t);
	} else {
		if (Qc(n, r)) return;
		Xc.set(r), e.uniformMatrix2fv(this.addr, !1, Xc), $c(n, r);
	}
}
function ol(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (Qc(n, t)) return;
		e.uniformMatrix3fv(this.addr, !1, t), $c(n, t);
	} else {
		if (Qc(n, r)) return;
		Yc.set(r), e.uniformMatrix3fv(this.addr, !1, Yc), $c(n, r);
	}
}
function sl(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (Qc(n, t)) return;
		e.uniformMatrix4fv(this.addr, !1, t), $c(n, t);
	} else {
		if (Qc(n, r)) return;
		Jc.set(r), e.uniformMatrix4fv(this.addr, !1, Jc), $c(n, r);
	}
}
function cl(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1i(this.addr, t), n[0] = t);
}
function ll(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2i(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (Qc(n, t)) return;
		e.uniform2iv(this.addr, t), $c(n, t);
	}
}
function ul(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3i(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (Qc(n, t)) return;
		e.uniform3iv(this.addr, t), $c(n, t);
	}
}
function dl(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4i(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (Qc(n, t)) return;
		e.uniform4iv(this.addr, t), $c(n, t);
	}
}
function fl(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1ui(this.addr, t), n[0] = t);
}
function pl(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2ui(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (Qc(n, t)) return;
		e.uniform2uiv(this.addr, t), $c(n, t);
	}
}
function ml(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3ui(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (Qc(n, t)) return;
		e.uniform3uiv(this.addr, t), $c(n, t);
	}
}
function hl(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (Qc(n, t)) return;
		e.uniform4uiv(this.addr, t), $c(n, t);
	}
}
function gl(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i);
	let a;
	this.type === e.SAMPLER_2D_SHADOW ? (Hc.compareFunction = n.isReversedDepthBuffer() ? 518 : 515, a = Hc) : a = Vc, n.setTexture2D(t || a, i);
}
function _l(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture3D(t || Wc, i);
}
function vl(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTextureCube(t || Gc, i);
}
function yl(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture2DArray(t || Uc, i);
}
function bl(e) {
	switch (e) {
		case 5126: return tl;
		case 35664: return nl;
		case 35665: return rl;
		case 35666: return il;
		case 35674: return al;
		case 35675: return ol;
		case 35676: return sl;
		case 5124:
		case 35670: return cl;
		case 35667:
		case 35671: return ll;
		case 35668:
		case 35672: return ul;
		case 35669:
		case 35673: return dl;
		case 5125: return fl;
		case 36294: return pl;
		case 36295: return ml;
		case 36296: return hl;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return gl;
		case 35679:
		case 36299:
		case 36307: return _l;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return vl;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return yl;
	}
}
function xl(e, t) {
	e.uniform1fv(this.addr, t);
}
function Sl(e, t) {
	let n = Zc(t, this.size, 2);
	e.uniform2fv(this.addr, n);
}
function Cl(e, t) {
	let n = Zc(t, this.size, 3);
	e.uniform3fv(this.addr, n);
}
function wl(e, t) {
	let n = Zc(t, this.size, 4);
	e.uniform4fv(this.addr, n);
}
function Tl(e, t) {
	let n = Zc(t, this.size, 4);
	e.uniformMatrix2fv(this.addr, !1, n);
}
function El(e, t) {
	let n = Zc(t, this.size, 9);
	e.uniformMatrix3fv(this.addr, !1, n);
}
function Dl(e, t) {
	let n = Zc(t, this.size, 16);
	e.uniformMatrix4fv(this.addr, !1, n);
}
function Ol(e, t) {
	e.uniform1iv(this.addr, t);
}
function kl(e, t) {
	e.uniform2iv(this.addr, t);
}
function Al(e, t) {
	e.uniform3iv(this.addr, t);
}
function jl(e, t) {
	e.uniform4iv(this.addr, t);
}
function Ml(e, t) {
	e.uniform1uiv(this.addr, t);
}
function Nl(e, t) {
	e.uniform2uiv(this.addr, t);
}
function Pl(e, t) {
	e.uniform3uiv(this.addr, t);
}
function Fl(e, t) {
	e.uniform4uiv(this.addr, t);
}
function Il(e, t, n) {
	let r = this.cache, i = t.length, a = el(n, i);
	Qc(r, a) || (e.uniform1iv(this.addr, a), $c(r, a));
	let o;
	o = this.type === e.SAMPLER_2D_SHADOW ? Hc : Vc;
	for (let e = 0; e !== i; ++e) n.setTexture2D(t[e] || o, a[e]);
}
function Ll(e, t, n) {
	let r = this.cache, i = t.length, a = el(n, i);
	Qc(r, a) || (e.uniform1iv(this.addr, a), $c(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture3D(t[e] || Wc, a[e]);
}
function Rl(e, t, n) {
	let r = this.cache, i = t.length, a = el(n, i);
	Qc(r, a) || (e.uniform1iv(this.addr, a), $c(r, a));
	for (let e = 0; e !== i; ++e) n.setTextureCube(t[e] || Gc, a[e]);
}
function zl(e, t, n) {
	let r = this.cache, i = t.length, a = el(n, i);
	Qc(r, a) || (e.uniform1iv(this.addr, a), $c(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture2DArray(t[e] || Uc, a[e]);
}
function Bl(e) {
	switch (e) {
		case 5126: return xl;
		case 35664: return Sl;
		case 35665: return Cl;
		case 35666: return wl;
		case 35674: return Tl;
		case 35675: return El;
		case 35676: return Dl;
		case 5124:
		case 35670: return Ol;
		case 35667:
		case 35671: return kl;
		case 35668:
		case 35672: return Al;
		case 35669:
		case 35673: return jl;
		case 5125: return Ml;
		case 36294: return Nl;
		case 36295: return Pl;
		case 36296: return Fl;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return Il;
		case 35679:
		case 36299:
		case 36307: return Ll;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return Rl;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return zl;
	}
}
var Vl = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = bl(t.type);
	}
}, Hl = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = Bl(t.type);
	}
}, Ul = class {
	constructor(e) {
		this.id = e, this.seq = [], this.map = {};
	}
	setValue(e, t, n) {
		let r = this.seq;
		for (let i = 0, a = r.length; i !== a; ++i) {
			let a = r[i];
			a.setValue(e, t[a.id], n);
		}
	}
}, Wl = /(\w+)(\])?(\[|\.)?/g;
function Gl(e, t) {
	e.seq.push(t), e.map[t.id] = t;
}
function Kl(e, t, n) {
	let r = e.name, i = r.length;
	for (Wl.lastIndex = 0;;) {
		let a = Wl.exec(r), o = Wl.lastIndex, s = a[1], c = a[2] === "]", l = a[3];
		if (c && (s |= 0), l === void 0 || l === "[" && o + 2 === i) {
			Gl(n, l === void 0 ? new Vl(s, e, t) : new Hl(s, e, t));
			break;
		}
		{
			let e = n.map[s];
			e === void 0 && (e = new Ul(s), Gl(n, e)), n = e;
		}
	}
}
var ql = class {
	constructor(e, t) {
		this.seq = [], this.map = {};
		let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
		for (let r = 0; r < n; ++r) {
			let n = e.getActiveUniform(t, r);
			Kl(n, e.getUniformLocation(t, n.name), this);
		}
		let r = [], i = [];
		for (let t of this.seq) t.type === e.SAMPLER_2D_SHADOW || t.type === e.SAMPLER_CUBE_SHADOW || t.type === e.SAMPLER_2D_ARRAY_SHADOW ? r.push(t) : i.push(t);
		r.length > 0 && (this.seq = r.concat(i));
	}
	setValue(e, t, n, r) {
		let i = this.map[t];
		i !== void 0 && i.setValue(e, n, r);
	}
	setOptional(e, t, n) {
		let r = t[n];
		r !== void 0 && this.setValue(e, n, r);
	}
	static upload(e, t, n, r) {
		for (let i = 0, a = t.length; i !== a; ++i) {
			let a = t[i], o = n[a.id];
			o.needsUpdate !== !1 && a.setValue(e, o.value, r);
		}
	}
	static seqWithValue(e, t) {
		let n = [];
		for (let r = 0, i = e.length; r !== i; ++r) {
			let i = e[r];
			i.id in t && n.push(i);
		}
		return n;
	}
};
function Jl(e, t, n) {
	let r = e.createShader(t);
	return e.shaderSource(r, n), e.compileShader(r), r;
}
var Yl = 37297, Xl = 0;
function Zl(e, t) {
	let n = e.split("\n"), r = [], i = Math.max(t - 6, 0), a = Math.min(t + 6, n.length);
	for (let e = i; e < a; e++) {
		let i = e + 1;
		r.push(`${i === t ? ">" : " "} ${i}: ${n[e]}`);
	}
	return r.join("\n");
}
var Ql = /*@__PURE__*/ new G();
function $l(e) {
	K._getMatrix(Ql, K.workingColorSpace, e);
	let t = `mat3( ${Ql.elements.map((e) => e.toFixed(4))} )`;
	switch (K.getTransfer(e)) {
		case He: return [t, "LinearTransferOETF"];
		case Ue: return [t, "sRGBTransferOETF"];
		default: return B("WebGLProgram: Unsupported color space: ", e), [t, "LinearTransferOETF"];
	}
}
function eu(e, t, n) {
	let r = e.getShaderParameter(t, e.COMPILE_STATUS), i = (e.getShaderInfoLog(t) || "").trim();
	if (r && i === "") return "";
	let a = /ERROR: 0:(\d+)/.exec(i);
	if (a) {
		let r = parseInt(a[1]);
		return n.toUpperCase() + "\n\n" + i + "\n\n" + Zl(e.getShaderSource(t), r);
	}
	return i;
}
function tu(e, t) {
	let n = $l(t);
	return [
		`vec4 ${e}( vec4 value ) {`,
		`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
		"}"
	].join("\n");
}
var nu = {
	1: "Linear",
	2: "Reinhard",
	3: "Cineon",
	4: "ACESFilmic",
	6: "AgX",
	7: "Neutral",
	5: "Custom"
};
function ru(e, t) {
	let n = nu[t];
	return n === void 0 ? (B("WebGLProgram: Unsupported toneMapping:", t), "vec3 " + e + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + e + "( vec3 color ) { return " + n + "ToneMapping( color ); }";
}
var iu = /*@__PURE__*/ new W();
function au() {
	return K.getLuminanceCoefficients(iu), [
		"float luminance( const in vec3 rgb ) {",
		`	const vec3 weights = vec3( ${iu.x.toFixed(4)}, ${iu.y.toFixed(4)}, ${iu.z.toFixed(4)} );`,
		"	return dot( weights, rgb );",
		"}"
	].join("\n");
}
function ou(e) {
	return [e.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", e.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(lu).join("\n");
}
function su(e) {
	let t = [];
	for (let n in e) {
		let r = e[n];
		r !== !1 && t.push("#define " + n + " " + r);
	}
	return t.join("\n");
}
function cu(e, t) {
	let n = {}, r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveAttrib(t, i), a = r.name, o = 1;
		r.type === e.FLOAT_MAT2 && (o = 2), r.type === e.FLOAT_MAT3 && (o = 3), r.type === e.FLOAT_MAT4 && (o = 4), n[a] = {
			type: r.type,
			location: e.getAttribLocation(t, a),
			locationSize: o
		};
	}
	return n;
}
function lu(e) {
	return e !== "";
}
function uu(e, t) {
	let n = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
	return e.replace(/NUM_SUN_LIGHTS/g, t.numSunLights).replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g, t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function du(e, t) {
	return e.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
var fu = /^[ \t]*#include +<([\w\d./]+)>/gm;
function pu(e) {
	return e.replace(fu, hu);
}
var mu = /* @__PURE__ */ new Map();
function hu(e, t) {
	let n = Y[t];
	if (n === void 0) {
		let e = mu.get(t);
		if (e !== void 0) n = Y[e], B("WebGLRenderer: Shader chunk \"%s\" has been deprecated. Use \"%s\" instead.", t, e);
		else throw Error("THREE.WebGLProgram: Can not resolve #include <" + t + ">");
	}
	return pu(n);
}
var gu = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function _u(e) {
	return e.replace(gu, vu);
}
function vu(e, t, n, r) {
	let i = "";
	for (let e = parseInt(t); e < parseInt(n); e++) i += r.replace(/\[\s*i\s*\]/g, "[ " + e + " ]").replace(/UNROLLED_LOOP_INDEX/g, e);
	return i;
}
function yu(e) {
	let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
	return e.precision === "highp" ? t += "\n#define HIGH_PRECISION" : e.precision === "mediump" ? t += "\n#define MEDIUM_PRECISION" : e.precision === "lowp" && (t += "\n#define LOW_PRECISION"), t;
}
var bu = {
	1: "SHADOWMAP_TYPE_PCF",
	3: "SHADOWMAP_TYPE_VSM"
};
function xu(e) {
	return bu[e.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
var Su = {
	301: "ENVMAP_TYPE_CUBE",
	302: "ENVMAP_TYPE_CUBE",
	306: "ENVMAP_TYPE_CUBE_UV"
};
function Cu(e) {
	return e.envMap === !1 ? "ENVMAP_TYPE_CUBE" : Su[e.envMapMode] || "ENVMAP_TYPE_CUBE";
}
var wu = { 302: "ENVMAP_MODE_REFRACTION" };
function Tu(e) {
	return e.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : wu[e.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
var Eu = {
	0: "ENVMAP_BLENDING_MULTIPLY",
	1: "ENVMAP_BLENDING_MIX",
	2: "ENVMAP_BLENDING_ADD"
};
function Du(e) {
	return e.envMap === !1 ? "ENVMAP_BLENDING_NONE" : Eu[e.combine] || "ENVMAP_BLENDING_NONE";
}
function Ou(e) {
	let t = e.envMapCubeUVHeight;
	if (t === null) return null;
	let n = Math.log2(t) - 2, r = 1 / t;
	return {
		texelWidth: 1 / (3 * Math.max(2 ** n, 112)),
		texelHeight: r,
		maxMip: n
	};
}
function ku(e, t, n, r) {
	let i = e.getContext(), a = n.defines, o = n.vertexShader, s = n.fragmentShader, c = xu(n), l = Cu(n), u = Tu(n), d = Du(n), f = Ou(n), p = ou(n), m = su(a), h = i.createProgram(), g, _, v = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
	n.isRawShaderMaterial ? (g = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter(lu).join("\n"), g.length > 0 && (g += "\n"), _ = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter(lu).join("\n"), _.length > 0 && (_ += "\n")) : (g = [
		yu(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
		n.batching ? "#define USE_BATCHING" : "",
		n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
		n.instancing ? "#define USE_INSTANCING" : "",
		n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
		n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.map ? "#define USE_MAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + u : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.mapUv ? "#define MAP_UV " + n.mapUv : "",
		n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
		n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
		n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
		n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
		n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
		n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
		n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "",
		n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
		n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
		n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "",
		n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
		n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "",
		n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "",
		n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "",
		n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "",
		n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "",
		n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "",
		n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
		n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "",
		n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "",
		n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "",
		n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexNormals ? "#define HAS_NORMAL" : "",
		n.vertexColors ? "#define USE_COLOR" : "",
		n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.skinning ? "#define USE_SKINNING" : "",
		n.morphTargets ? "#define USE_MORPHTARGETS" : "",
		n.morphNormals && n.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
		n.morphColors ? "#define USE_MORPHCOLORS" : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 modelMatrix;",
		"uniform mat4 modelViewMatrix;",
		"uniform mat4 projectionMatrix;",
		"uniform mat4 viewMatrix;",
		"uniform mat3 normalMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		"#ifdef USE_INSTANCING",
		"	attribute mat4 instanceMatrix;",
		"#endif",
		"#ifdef USE_INSTANCING_COLOR",
		"	attribute vec3 instanceColor;",
		"#endif",
		"#ifdef USE_INSTANCING_MORPH",
		"	uniform sampler2D morphTexture;",
		"#endif",
		"attribute vec3 position;",
		"attribute vec3 normal;",
		"attribute vec2 uv;",
		"#ifdef USE_UV1",
		"	attribute vec2 uv1;",
		"#endif",
		"#ifdef USE_UV2",
		"	attribute vec2 uv2;",
		"#endif",
		"#ifdef USE_UV3",
		"	attribute vec2 uv3;",
		"#endif",
		"#ifdef USE_TANGENT",
		"	attribute vec4 tangent;",
		"#endif",
		"#if defined( USE_COLOR_ALPHA )",
		"	attribute vec4 color;",
		"#elif defined( USE_COLOR )",
		"	attribute vec3 color;",
		"#endif",
		"#ifdef USE_SKINNING",
		"	attribute vec4 skinIndex;",
		"	attribute vec4 skinWeight;",
		"#endif",
		"\n"
	].filter(lu).join("\n"), _ = [
		yu(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
		n.map ? "#define USE_MAP" : "",
		n.matcap ? "#define USE_MATCAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + l : "",
		n.envMap ? "#define " + u : "",
		n.envMap ? "#define " + d : "",
		f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
		f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
		f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoat ? "#define USE_CLEARCOAT" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.dispersion ? "#define USE_DISPERSION" : "",
		n.retroreflection ? "#define USE_RETROREFLECTION" : "",
		n.iridescence ? "#define USE_IRIDESCENCE" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaTest ? "#define USE_ALPHATEST" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.sheen ? "#define USE_SHEEN" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "",
		n.vertexAlphas || n.batchingColor ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.gradientMap ? "#define USE_GRADIENTMAP" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
		n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
		n.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 viewMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		n.toneMapping === 0 ? "" : "#define TONE_MAPPING",
		n.toneMapping === 0 ? "" : Y.tonemapping_pars_fragment,
		n.toneMapping === 0 ? "" : ru("toneMapping", n.toneMapping),
		n.dithering ? "#define DITHERING" : "",
		n.opaque ? "#define OPAQUE" : "",
		Y.colorspace_pars_fragment,
		tu("linearToOutputTexel", n.outputColorSpace),
		au(),
		n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
		"\n"
	].filter(lu).join("\n")), o = pu(o), o = uu(o, n), o = du(o, n), s = pu(s), s = uu(s, n), s = du(s, n), o = _u(o), s = _u(s), n.isRawShaderMaterial !== !0 && (v = "#version 300 es\n", g = [
		p,
		"#define attribute in",
		"#define varying out",
		"#define texture2D texture"
	].join("\n") + "\n" + g, _ = [
		"#define varying in",
		n.glslVersion === "300 es" ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
		n.glslVersion === "300 es" ? "" : "#define gl_FragColor pc_fragColor",
		"#define gl_FragDepthEXT gl_FragDepth",
		"#define texture2D texture",
		"#define textureCube texture",
		"#define texture2DProj textureProj",
		"#define texture2DLodEXT textureLod",
		"#define texture2DProjLodEXT textureProjLod",
		"#define textureCubeLodEXT textureLod",
		"#define texture2DGradEXT textureGrad",
		"#define texture2DProjGradEXT textureProjGrad",
		"#define textureCubeGradEXT textureGrad"
	].join("\n") + "\n" + _);
	let y = v + g + o, b = v + _ + s, x = Jl(i, i.VERTEX_SHADER, y), S = Jl(i, i.FRAGMENT_SHADER, b);
	i.attachShader(h, x), i.attachShader(h, S), n.index0AttributeName === void 0 ? n.hasPositionAttribute === !0 && i.bindAttribLocation(h, 0, "position") : i.bindAttribLocation(h, 0, n.index0AttributeName), i.linkProgram(h);
	function C(t) {
		if (e.debug.checkShaderErrors) {
			let n = i.getProgramInfoLog(h) || "", r = i.getShaderInfoLog(x) || "", a = i.getShaderInfoLog(S) || "", o = n.trim(), s = r.trim(), c = a.trim(), l = !0, u = !0;
			if (i.getProgramParameter(h, i.LINK_STATUS) === !1) {
				if (l = !1, typeof e.debug.onShaderError == "function") e.debug.onShaderError(i, h, x, S);
				else {
					let e = eu(i, x, "vertex"), n = eu(i, S, "fragment");
					V("WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(h, i.VALIDATE_STATUS) + "\n\nMaterial Name: " + t.name + "\nMaterial Type: " + t.type + "\n\nProgram Info Log: " + o + "\n" + e + "\n" + n);
				}
			} else o === "" ? (s === "" || c === "") && (u = !1) : B("WebGLProgram: Program Info Log:", o);
			u && (t.diagnostics = {
				runnable: l,
				programLog: o,
				vertexShader: {
					log: s,
					prefix: g
				},
				fragmentShader: {
					log: c,
					prefix: _
				}
			});
		}
		i.deleteShader(x), i.deleteShader(S), w = new ql(i, h), T = cu(i, h);
	}
	let w;
	this.getUniforms = function() {
		return w === void 0 && C(this), w;
	};
	let T;
	this.getAttributes = function() {
		return T === void 0 && C(this), T;
	};
	let E = n.rendererExtensionParallelShaderCompile === !1;
	return this.isReady = function() {
		return E === !1 && (E = i.getProgramParameter(h, Yl)), E;
	}, this.destroy = function() {
		r.releaseStatesOfProgram(this), i.deleteProgram(h), this.program = void 0;
	}, this.type = n.shaderType, this.name = n.shaderName, this.id = Xl++, this.cacheKey = t, this.usedTimes = 1, this.program = h, this.vertexShader = x, this.fragmentShader = S, this;
}
var Au = 0, ju = class {
	constructor() {
		this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
	}
	update(e, t, n) {
		let r = this._getShaderCacheForMaterial(e);
		return r.has(t) === !1 && (r.add(t), t.usedTimes++), r.has(n) === !1 && (r.add(n), n.usedTimes++), this;
	}
	remove(e) {
		let t = this.materialCache.get(e);
		for (let e of t) e.usedTimes--, e.usedTimes === 0 && this.shaderCache.delete(e.code);
		return this.materialCache.delete(e), this;
	}
	getVertexShaderStage(e) {
		return this._getShaderStage(e.vertexShader);
	}
	getFragmentShaderStage(e) {
		return this._getShaderStage(e.fragmentShader);
	}
	dispose() {
		this.shaderCache.clear(), this.materialCache.clear();
	}
	_getShaderCacheForMaterial(e) {
		let t = this.materialCache, n = t.get(e);
		return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
	}
	_getShaderStage(e) {
		let t = this.shaderCache, n = t.get(e);
		return n === void 0 && (n = new Mu(e), t.set(e, n)), n;
	}
}, Mu = class {
	constructor(e) {
		this.id = Au++, this.code = e, this.usedTimes = 0;
	}
};
function Nu(e) {
	return e === 1030 || e === 37490 || e === 36285;
}
function Pu(e, t, n, r, i, a) {
	let o = new ln(), s = new ju(), c = /* @__PURE__ */ new Set(), l = [], u = /* @__PURE__ */ new Map(), d = r.logarithmicDepthBuffer, f = r.precision, p = {
		MeshDepthMaterial: "depth",
		MeshDistanceMaterial: "distance",
		MeshNormalMaterial: "normal",
		MeshBasicMaterial: "basic",
		MeshLambertMaterial: "lambert",
		MeshPhongMaterial: "phong",
		MeshToonMaterial: "toon",
		MeshStandardMaterial: "physical",
		MeshPhysicalMaterial: "physical",
		MeshMatcapMaterial: "matcap",
		LineBasicMaterial: "basic",
		LineDashedMaterial: "dashed",
		PointsMaterial: "points",
		ShadowMaterial: "shadow",
		SpriteMaterial: "sprite"
	};
	function m(e) {
		return c.add(e), e === 0 ? "uv" : `uv${e}`;
	}
	function h(i, o, l, u, h, g) {
		let _ = u.fog, v = h.geometry, y = i.isMeshStandardMaterial || i.isMeshLambertMaterial || i.isMeshPhongMaterial ? u.environment : null, b = i.isMeshStandardMaterial || i.isMeshLambertMaterial && !i.envMap || i.isMeshPhongMaterial && !i.envMap, x = t.get(i.envMap || y, b), S = x && x.mapping === 306 ? x.image.height : null, C = p[i.type];
		i.precision !== null && (f = r.getMaxPrecision(i.precision), f !== i.precision && B("WebGLProgram.getParameters:", i.precision, "not supported, using", f, "instead."));
		let w = v.morphAttributes.position || v.morphAttributes.normal || v.morphAttributes.color, T = w === void 0 ? 0 : w.length, E = 0;
		v.morphAttributes.position !== void 0 && (E = 1), v.morphAttributes.normal !== void 0 && (E = 2), v.morphAttributes.color !== void 0 && (E = 3);
		let D, O, k, A;
		if (C) {
			let e = tc[C];
			D = e.vertexShader, O = e.fragmentShader;
		} else {
			D = i.vertexShader, O = i.fragmentShader;
			let e = s.getVertexShaderStage(i), t = s.getFragmentShaderStage(i);
			s.update(i, e, t), k = e.id, A = t.id;
		}
		let j = e.getRenderTarget(), ee = e.state.buffers.depth.getReversed(), te = h.isInstancedMesh === !0, M = h.isBatchedMesh === !0, ne = !!i.map, N = !!i.matcap, re = !!x, P = !!i.aoMap, ie = !!i.lightMap, ae = !!i.bumpMap && i.wireframe === !1, oe = !!i.normalMap, se = !!i.displacementMap, ce = !!i.emissiveMap, F = !!i.metalnessMap, le = !!i.roughnessMap, ue = i.anisotropy > 0, de = i.clearcoat > 0, fe = i.dispersion > 0, pe = i.retroreflectivity > 0, me = i.iridescence > 0, he = i.sheen > 0, ge = i.transmission > 0, _e = ue && !!i.anisotropyMap, ve = de && !!i.clearcoatMap, ye = de && !!i.clearcoatNormalMap, be = de && !!i.clearcoatRoughnessMap, xe = me && !!i.iridescenceMap, Se = me && !!i.iridescenceThicknessMap, Ce = he && !!i.sheenColorMap, we = he && !!i.sheenRoughnessMap, Te = !!i.specularMap, Ee = !!i.specularColorMap, De = !!i.specularIntensityMap, Oe = ge && !!i.transmissionMap, ke = ge && !!i.thicknessMap, Ae = !!i.gradientMap, je = !!i.alphaMap, Me = i.alphaTest > 0, I = !!i.alphaHash, Ne = !!i.extensions, Pe = 0;
		i.toneMapped && (j === null || j.isXRRenderTarget === !0) && (Pe = e.toneMapping);
		let Fe = {
			shaderID: C,
			shaderType: i.type,
			shaderName: i.name,
			vertexShader: D,
			fragmentShader: O,
			defines: i.defines,
			customVertexShaderID: k,
			customFragmentShaderID: A,
			isRawShaderMaterial: i.isRawShaderMaterial === !0,
			glslVersion: i.glslVersion,
			precision: f,
			batching: M,
			batchingColor: M && h._colorsTexture !== null,
			instancing: te,
			instancingColor: te && h.instanceColor !== null,
			instancingMorph: te && h.morphTexture !== null,
			outputColorSpace: j === null ? e.outputColorSpace : j.isXRRenderTarget === !0 ? j.texture.colorSpace : K.workingColorSpace,
			alphaToCoverage: !!i.alphaToCoverage,
			map: ne,
			matcap: N,
			envMap: re,
			envMapMode: re && x.mapping,
			envMapCubeUVHeight: S,
			aoMap: P,
			lightMap: ie,
			bumpMap: ae,
			normalMap: oe,
			displacementMap: se,
			emissiveMap: ce,
			normalMapObjectSpace: oe && i.normalMapType === 1,
			normalMapTangentSpace: oe && i.normalMapType === 0,
			packedNormalMap: oe && i.normalMapType === 0 && Nu(i.normalMap.format),
			metalnessMap: F,
			roughnessMap: le,
			anisotropy: ue,
			anisotropyMap: _e,
			clearcoat: de,
			clearcoatMap: ve,
			clearcoatNormalMap: ye,
			clearcoatRoughnessMap: be,
			dispersion: fe,
			retroreflection: pe,
			iridescence: me,
			iridescenceMap: xe,
			iridescenceThicknessMap: Se,
			sheen: he,
			sheenColorMap: Ce,
			sheenRoughnessMap: we,
			specularMap: Te,
			specularColorMap: Ee,
			specularIntensityMap: De,
			transmission: ge,
			transmissionMap: Oe,
			thicknessMap: ke,
			gradientMap: Ae,
			opaque: i.transparent === !1 && i.blending === 1 && i.alphaToCoverage === !1,
			alphaMap: je,
			alphaTest: Me,
			alphaHash: I,
			combine: i.combine,
			mapUv: ne && m(i.map.channel),
			aoMapUv: P && m(i.aoMap.channel),
			lightMapUv: ie && m(i.lightMap.channel),
			bumpMapUv: ae && m(i.bumpMap.channel),
			normalMapUv: oe && m(i.normalMap.channel),
			displacementMapUv: se && m(i.displacementMap.channel),
			emissiveMapUv: ce && m(i.emissiveMap.channel),
			metalnessMapUv: F && m(i.metalnessMap.channel),
			roughnessMapUv: le && m(i.roughnessMap.channel),
			anisotropyMapUv: _e && m(i.anisotropyMap.channel),
			clearcoatMapUv: ve && m(i.clearcoatMap.channel),
			clearcoatNormalMapUv: ye && m(i.clearcoatNormalMap.channel),
			clearcoatRoughnessMapUv: be && m(i.clearcoatRoughnessMap.channel),
			iridescenceMapUv: xe && m(i.iridescenceMap.channel),
			iridescenceThicknessMapUv: Se && m(i.iridescenceThicknessMap.channel),
			sheenColorMapUv: Ce && m(i.sheenColorMap.channel),
			sheenRoughnessMapUv: we && m(i.sheenRoughnessMap.channel),
			specularMapUv: Te && m(i.specularMap.channel),
			specularColorMapUv: Ee && m(i.specularColorMap.channel),
			specularIntensityMapUv: De && m(i.specularIntensityMap.channel),
			transmissionMapUv: Oe && m(i.transmissionMap.channel),
			thicknessMapUv: ke && m(i.thicknessMap.channel),
			alphaMapUv: je && m(i.alphaMap.channel),
			vertexTangents: !!v.attributes.tangent && (oe || ue),
			vertexNormals: !!v.attributes.normal,
			vertexColors: i.vertexColors,
			vertexAlphas: i.vertexColors === !0 && !!v.attributes.color && v.attributes.color.itemSize === 4,
			pointsUvs: h.isPoints === !0 && !!v.attributes.uv && (ne || je),
			fog: !!_,
			useFog: i.fog === !0,
			fogExp2: !!_ && _.isFogExp2,
			flatShading: i.wireframe === !1 && (i.flatShading === !0 || v.attributes.normal === void 0 && oe === !1 && (i.isMeshLambertMaterial || i.isMeshPhongMaterial || i.isMeshStandardMaterial || i.isMeshPhysicalMaterial)),
			sizeAttenuation: i.sizeAttenuation === !0,
			logarithmicDepthBuffer: d,
			reversedDepthBuffer: ee,
			skinning: h.isSkinnedMesh === !0,
			hasPositionAttribute: v.attributes.position !== void 0,
			morphTargets: v.morphAttributes.position !== void 0,
			morphNormals: v.morphAttributes.normal !== void 0,
			morphColors: v.morphAttributes.color !== void 0,
			morphTargetsCount: T,
			morphTextureStride: E,
			numSunLights: o.sun.length,
			numDirLights: o.directional.length,
			numPointLights: o.point.length,
			numSpotLights: o.spot.length,
			numSpotLightMaps: o.spotLightMap.length,
			numRectAreaLights: o.rectArea.length,
			numHemiLights: o.hemi.length,
			numSunLightShadows: o.sunShadowMap.length,
			numDirLightShadows: o.directionalShadowMap.length,
			numPointLightShadows: o.pointShadowMap.length,
			numSpotLightShadows: o.spotShadowMap.length,
			numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
			numLightProbes: o.numLightProbes,
			numLightProbeGrids: g.length,
			numClippingPlanes: a.numPlanes,
			numClipIntersection: a.numIntersection,
			dithering: i.dithering,
			shadowMapEnabled: e.shadowMap.enabled && l.length > 0,
			shadowMapType: e.shadowMap.type,
			toneMapping: Pe,
			decodeVideoTexture: ne && i.map.isVideoTexture === !0 && K.getTransfer(i.map.colorSpace) === "srgb",
			decodeVideoTextureEmissive: ce && i.emissiveMap.isVideoTexture === !0 && K.getTransfer(i.emissiveMap.colorSpace) === "srgb",
			premultipliedAlpha: i.premultipliedAlpha,
			doubleSided: i.side === 2,
			flipSided: i.side === 1,
			useDepthPacking: i.depthPacking >= 0,
			depthPacking: i.depthPacking || 0,
			index0AttributeName: i.index0AttributeName,
			extensionClipCullDistance: Ne && i.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
			extensionMultiDraw: (Ne && i.extensions.multiDraw === !0 || M) && n.has("WEBGL_multi_draw"),
			rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
			customProgramCacheKey: i.customProgramCacheKey()
		};
		return Fe.vertexUv1s = c.has(1), Fe.vertexUv2s = c.has(2), Fe.vertexUv3s = c.has(3), c.clear(), Fe;
	}
	function g(t) {
		let n = [];
		if (t.shaderID ? n.push(t.shaderID) : (n.push(t.customVertexShaderID), n.push(t.customFragmentShaderID)), t.defines !== void 0) for (let e in t.defines) n.push(e), n.push(t.defines[e]);
		return t.isRawShaderMaterial === !1 && (_(n, t), v(n, t), n.push(e.outputColorSpace)), n.push(t.customProgramCacheKey), n.join();
	}
	function _(e, t) {
		e.push(t.precision), e.push(t.outputColorSpace), e.push(t.envMapMode), e.push(t.envMapCubeUVHeight), e.push(t.mapUv), e.push(t.alphaMapUv), e.push(t.lightMapUv), e.push(t.aoMapUv), e.push(t.bumpMapUv), e.push(t.normalMapUv), e.push(t.displacementMapUv), e.push(t.emissiveMapUv), e.push(t.metalnessMapUv), e.push(t.roughnessMapUv), e.push(t.anisotropyMapUv), e.push(t.clearcoatMapUv), e.push(t.clearcoatNormalMapUv), e.push(t.clearcoatRoughnessMapUv), e.push(t.iridescenceMapUv), e.push(t.iridescenceThicknessMapUv), e.push(t.sheenColorMapUv), e.push(t.sheenRoughnessMapUv), e.push(t.specularMapUv), e.push(t.specularColorMapUv), e.push(t.specularIntensityMapUv), e.push(t.transmissionMapUv), e.push(t.thicknessMapUv), e.push(t.combine), e.push(t.fogExp2), e.push(t.sizeAttenuation), e.push(t.morphTargetsCount), e.push(t.morphAttributeCount), e.push(t.numSunLights), e.push(t.numDirLights), e.push(t.numPointLights), e.push(t.numSpotLights), e.push(t.numSpotLightMaps), e.push(t.numHemiLights), e.push(t.numRectAreaLights), e.push(t.numSunLightShadows), e.push(t.numDirLightShadows), e.push(t.numPointLightShadows), e.push(t.numSpotLightShadows), e.push(t.numSpotLightShadowsWithMaps), e.push(t.numLightProbes), e.push(t.shadowMapType), e.push(t.toneMapping), e.push(t.numClippingPlanes), e.push(t.numClipIntersection), e.push(t.depthPacking);
	}
	function v(e, t) {
		o.disableAll(), t.instancing && o.enable(0), t.instancingColor && o.enable(1), t.instancingMorph && o.enable(2), t.matcap && o.enable(3), t.envMap && o.enable(4), t.normalMapObjectSpace && o.enable(5), t.normalMapTangentSpace && o.enable(6), t.clearcoat && o.enable(7), t.iridescence && o.enable(8), t.alphaTest && o.enable(9), t.vertexColors && o.enable(10), t.vertexAlphas && o.enable(11), t.vertexUv1s && o.enable(12), t.vertexUv2s && o.enable(13), t.vertexUv3s && o.enable(14), t.vertexTangents && o.enable(15), t.anisotropy && o.enable(16), t.alphaHash && o.enable(17), t.batching && o.enable(18), t.dispersion && o.enable(19), t.retroreflection && o.enable(24), t.batchingColor && o.enable(20), t.gradientMap && o.enable(21), t.packedNormalMap && o.enable(22), t.vertexNormals && o.enable(23), e.push(o.mask), o.disableAll(), t.fog && o.enable(0), t.useFog && o.enable(1), t.flatShading && o.enable(2), t.logarithmicDepthBuffer && o.enable(3), t.reversedDepthBuffer && o.enable(4), t.skinning && o.enable(5), t.morphTargets && o.enable(6), t.morphNormals && o.enable(7), t.morphColors && o.enable(8), t.premultipliedAlpha && o.enable(9), t.shadowMapEnabled && o.enable(10), t.doubleSided && o.enable(11), t.flipSided && o.enable(12), t.useDepthPacking && o.enable(13), t.dithering && o.enable(14), t.transmission && o.enable(15), t.sheen && o.enable(16), t.opaque && o.enable(17), t.pointsUvs && o.enable(18), t.decodeVideoTexture && o.enable(19), t.decodeVideoTextureEmissive && o.enable(20), t.alphaToCoverage && o.enable(21), t.numLightProbeGrids > 0 && o.enable(22), t.hasPositionAttribute && o.enable(23), e.push(o.mask);
	}
	function y(e) {
		let t = p[e.type], n;
		if (t) {
			let e = tc[t];
			n = ao.clone(e.uniforms);
		} else n = e.uniforms;
		return n;
	}
	function b(t, n) {
		let r = u.get(n);
		return r === void 0 ? (r = new ku(e, n, t, i), l.push(r), u.set(n, r)) : ++r.usedTimes, r;
	}
	function x(e) {
		if (--e.usedTimes === 0) {
			let t = l.indexOf(e);
			l[t] = l[l.length - 1], l.pop(), u.delete(e.cacheKey), e.destroy();
		}
	}
	function S(e) {
		s.remove(e);
	}
	function C() {
		s.dispose();
	}
	return {
		getParameters: h,
		getProgramCacheKey: g,
		getUniforms: y,
		acquireProgram: b,
		releaseProgram: x,
		releaseShaderCache: S,
		programs: l,
		dispose: C
	};
}
function Fu() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t) {
		return e.has(t);
	}
	function n(t) {
		let n = e.get(t);
		return n === void 0 && (n = {}, e.set(t, n)), n;
	}
	function r(t) {
		e.delete(t);
	}
	function i(t, n, r) {
		e.get(t)[n] = r;
	}
	function a() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		has: t,
		get: n,
		remove: r,
		update: i,
		dispose: a
	};
}
function Iu(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.material.id === t.material.id ? e.materialVariant === t.materialVariant ? e.z === t.z ? e.id - t.id : e.z - t.z : e.materialVariant - t.materialVariant : e.material.id - t.material.id : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Lu(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.z === t.z ? e.id - t.id : t.z - e.z : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Ru() {
	let e = [], t = 0, n = [], r = [], i = [];
	function a() {
		t = 0, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		let t = 0;
		return e.isInstancedMesh && (t += 2), e.isSkinnedMesh && (t += 1), t;
	}
	function s(n, r, i, a, s, c) {
		let l = e[t];
		return l === void 0 ? (l = {
			id: n.id,
			object: n,
			geometry: r,
			material: i,
			materialVariant: o(n),
			groupOrder: a,
			renderOrder: n.renderOrder,
			z: s,
			group: c
		}, e[t] = l) : (l.id = n.id, l.object = n, l.geometry = r, l.material = i, l.materialVariant = o(n), l.groupOrder = a, l.renderOrder = n.renderOrder, l.z = s, l.group = c), t++, l;
	}
	function c(e, t, a, o, c, l, u) {
		u.reversedDepth === !0 && (c = -c);
		let d = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.push(d) : a.transparent === !0 ? i.push(d) : n.push(d);
	}
	function l(e, t, a, o, c, l) {
		let u = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.unshift(u) : a.transparent === !0 ? i.unshift(u) : n.unshift(u);
	}
	function u(e, t) {
		n.length > 1 && n.sort(e || Iu), r.length > 1 && r.sort(t || Lu), i.length > 1 && i.sort(t || Lu);
	}
	function d() {
		for (let n = t, r = e.length; n < r; n++) {
			let t = e[n];
			if (t.id === null) break;
			t.id = null, t.object = null, t.geometry = null, t.material = null, t.group = null;
		}
	}
	return {
		opaque: n,
		transmissive: r,
		transparent: i,
		init: a,
		push: c,
		unshift: l,
		finish: d,
		sort: u
	};
}
function zu() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n) {
		let r = e.get(t), i;
		return r === void 0 ? (i = new Ru(), e.set(t, [i])) : n >= r.length ? (i = new Ru(), r.push(i)) : i = r[n], i;
	}
	function n() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: t,
		dispose: n
	};
}
function Bu() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					direction: new W(),
					color: new J()
				};
				break;
			case "SpotLight":
				n = {
					position: new W(),
					direction: new W(),
					color: new J(),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0
				};
				break;
			case "PointLight":
				n = {
					position: new W(),
					color: new J(),
					distance: 0,
					decay: 0
				};
				break;
			case "HemisphereLight":
				n = {
					direction: new W(),
					skyColor: new J(),
					groundColor: new J()
				};
				break;
			case "RectAreaLight": n = {
				color: new J(),
				position: new W(),
				halfWidth: new W(),
				halfHeight: new W()
			};
		}
		return e[t.id] = n, n;
	} };
}
function Vu() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new U()
				};
				break;
			case "SpotLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new U()
				};
				break;
			case "PointLight": n = {
				shadowIntensity: 1,
				shadowBias: 0,
				shadowNormalBias: 0,
				shadowRadius: 1,
				shadowMapSize: new U(),
				shadowCameraNear: 1,
				shadowCameraFar: 1e3
			};
		}
		return e[t.id] = n, n;
	} };
}
var Hu = 0;
function Uu(e, t) {
	return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + +!!t.map - !!e.map;
}
function Wu(e) {
	let t = new Bu(), n = Vu(), r = {
		version: 0,
		hash: {
			sunLength: -1,
			directionalLength: -1,
			pointLength: -1,
			spotLength: -1,
			rectAreaLength: -1,
			hemiLength: -1,
			numSunShadows: -1,
			numDirectionalShadows: -1,
			numPointShadows: -1,
			numSpotShadows: -1,
			numSpotMaps: -1,
			numLightProbes: -1
		},
		ambient: [
			0,
			0,
			0
		],
		probe: [],
		sun: [],
		sunShadow: [],
		sunShadowMap: [],
		sunShadowMatrix: [],
		sunShadowCascade: [],
		directional: [],
		directionalShadow: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotLightMap: [],
		spotShadow: [],
		spotShadowMap: [],
		spotLightMatrix: [],
		rectArea: [],
		rectAreaLTC1: null,
		rectAreaLTC2: null,
		point: [],
		pointShadow: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: [],
		numSpotLightShadowsWithMaps: 0,
		numLightProbes: 0
	};
	for (let e = 0; e < 9; e++) r.probe.push(new W());
	let i = new W(), a = new q(), o = new q();
	function s(i) {
		let a = 0, o = 0, s = 0;
		for (let e = 0; e < 9; e++) r.probe[e].set(0, 0, 0);
		let c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y = 0, b = 0, x = 0;
		i.sort(Uu);
		for (let e = 0, S = i.length; e < S; e++) {
			let S = i[e], C = S.color, w = S.intensity, T = S.distance, E = null;
			if (S.shadow && S.shadow.map && (E = S.shadow.map.texture.format === 1030 ? S.shadow.map.texture : S.shadow.map.depthTexture || S.shadow.map.texture), S.isAmbientLight) a += C.r * w, o += C.g * w, s += C.b * w;
			else if (S.isLightProbe) {
				for (let e = 0; e < 9; e++) r.probe[e].addScaledVector(S.sh.coefficients[e], w);
				x++;
			} else if (S.isSunLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()), r.sunShadow[l] = t, r.sunShadowMap[l] = E;
					let i = e.getViewportCount();
					for (let t = 0; t < i; t++) r.sunShadowMatrix[u + t] = e.getMatrix(t), r.sunShadowCascade[u + t] = e._cascadeData[t];
					u += i, l++;
				}
				r.sun[c] = e, c++;
			} else if (S.isDirectionalLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, r.directionalShadow[d] = t, r.directionalShadowMap[d] = E, r.directionalShadowMatrix[d] = S.shadow.matrix, g++;
				}
				r.directional[d] = e, d++;
			} else if (S.isSpotLight) {
				let e = t.get(S);
				e.position.setFromMatrixPosition(S.matrixWorld), e.color.copy(C).multiplyScalar(w), e.distance = T, e.coneCos = Math.cos(S.angle), e.penumbraCos = Math.cos(S.angle * (1 - S.penumbra)), e.decay = S.decay, r.spot[p] = e;
				let i = S.shadow;
				if (S.map && (r.spotLightMap[y] = S.map, y++, i.updateMatrices(S), S.castShadow && b++), r.spotLightMatrix[p] = i.matrix, S.castShadow) {
					let e = n.get(S);
					e.shadowIntensity = i.intensity, e.shadowBias = i.bias, e.shadowNormalBias = i.normalBias, e.shadowRadius = i.radius, e.shadowMapSize = i.mapSize, r.spotShadow[p] = e, r.spotShadowMap[p] = E, v++;
				}
				p++;
			} else if (S.isRectAreaLight) {
				let e = t.get(S);
				e.color.copy(C).multiplyScalar(w), e.halfWidth.set(S.width * .5, 0, 0), e.halfHeight.set(0, S.height * .5, 0), r.rectArea[m] = e, m++;
			} else if (S.isPointLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), e.distance = S.distance, e.decay = S.decay, S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, t.shadowCameraNear = e.camera.near, t.shadowCameraFar = e.camera.far, r.pointShadow[f] = t, r.pointShadowMap[f] = E, r.pointShadowMatrix[f] = S.shadow.matrix, _++;
				}
				r.point[f] = e, f++;
			} else if (S.isHemisphereLight) {
				let e = t.get(S);
				e.skyColor.copy(S.color).multiplyScalar(w), e.groundColor.copy(S.groundColor).multiplyScalar(w), r.hemi[h] = e, h++;
			}
		}
		m > 0 && (e.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = X.LTC_FLOAT_1, r.rectAreaLTC2 = X.LTC_FLOAT_2) : (r.rectAreaLTC1 = X.LTC_HALF_1, r.rectAreaLTC2 = X.LTC_HALF_2)), r.ambient[0] = a, r.ambient[1] = o, r.ambient[2] = s;
		let S = r.hash;
		(S.sunLength !== c || S.directionalLength !== d || S.pointLength !== f || S.spotLength !== p || S.rectAreaLength !== m || S.hemiLength !== h || S.numSunShadows !== l || S.numDirectionalShadows !== g || S.numPointShadows !== _ || S.numSpotShadows !== v || S.numSpotMaps !== y || S.numLightProbes !== x) && (r.sun.length = c, r.directional.length = d, r.spot.length = p, r.rectArea.length = m, r.point.length = f, r.hemi.length = h, r.sunShadow.length = l, r.sunShadowMap.length = l, r.sunShadowMatrix.length = u, r.sunShadowCascade.length = u, r.directionalShadow.length = g, r.directionalShadowMap.length = g, r.directionalShadowMatrix.length = g, r.pointShadow.length = _, r.pointShadowMap.length = _, r.pointShadowMatrix.length = _, r.spotShadow.length = v, r.spotShadowMap.length = v, r.spotLightMatrix.length = v + y - b, r.spotLightMap.length = y, r.numSpotLightShadowsWithMaps = b, r.numLightProbes = x, S.sunLength = c, S.directionalLength = d, S.pointLength = f, S.spotLength = p, S.rectAreaLength = m, S.hemiLength = h, S.numSunShadows = l, S.numDirectionalShadows = g, S.numPointShadows = _, S.numSpotShadows = v, S.numSpotMaps = y, S.numLightProbes = x, r.version = Hu++);
	}
	function c(e, t) {
		let n = 0, s = 0, c = 0, l = 0, u = 0, d = 0, f = t.matrixWorldInverse;
		for (let t = 0, p = e.length; t < p; t++) {
			let p = e[t];
			if (p.isSunLight) {
				let e = r.sun[n];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), n++;
			} else if (p.isDirectionalLight) {
				let e = r.directional[s];
				e.direction.setFromMatrixPosition(p.matrixWorld), i.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(f), s++;
			} else if (p.isSpotLight) {
				let e = r.spot[l];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), e.direction.setFromMatrixPosition(p.matrixWorld), i.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(f), l++;
			} else if (p.isRectAreaLight) {
				let e = r.rectArea[u];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), o.identity(), a.copy(p.matrixWorld), a.premultiply(f), o.extractRotation(a), e.halfWidth.set(p.width * .5, 0, 0), e.halfHeight.set(0, p.height * .5, 0), e.halfWidth.applyMatrix4(o), e.halfHeight.applyMatrix4(o), u++;
			} else if (p.isPointLight) {
				let e = r.point[c];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), c++;
			} else if (p.isHemisphereLight) {
				let e = r.hemi[d];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), d++;
			}
		}
	}
	return {
		setup: s,
		setupView: c,
		state: r
	};
}
function Gu(e) {
	let t = new Wu(e), n = [], r = [], i = [];
	function a(e) {
		d.camera = e, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		n.push(e);
	}
	function s(e) {
		r.push(e);
	}
	function c(e) {
		i.push(e);
	}
	function l() {
		t.setup(n);
	}
	function u(e) {
		t.setupView(n, e);
	}
	let d = {
		lightsArray: n,
		shadowsArray: r,
		lightProbeGridArray: i,
		camera: null,
		lights: t,
		transmissionRenderTarget: {},
		textureUnits: 0
	};
	return {
		init: a,
		state: d,
		setupLights: l,
		setupLightsView: u,
		pushLight: o,
		pushShadow: s,
		pushLightProbeGrid: c
	};
}
function Ku(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(n, r = 0) {
		let i = t.get(n), a;
		return i === void 0 ? (a = new Gu(e), t.set(n, [a])) : r >= i.length ? (a = new Gu(e), i.push(a)) : a = i[r], a;
	}
	function r() {
		t = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: n,
		dispose: r
	};
}
var qu = "void main() {\n	gl_Position = vec4( position, 1.0 );\n}", Ju = "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\nvoid main() {\n	const float samples = float( VSM_SAMPLES );\n	float mean = 0.0;\n	float squared_mean = 0.0;\n	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n	for ( float i = 0.0; i < samples; i ++ ) {\n		float uvOffset = uvStart + i * uvStride;\n		#ifdef HORIZONTAL_PASS\n			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;\n			mean += distribution.x;\n			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n		#else\n			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;\n			mean += depth;\n			squared_mean += depth * depth;\n		#endif\n	}\n	mean = mean / samples;\n	squared_mean = squared_mean / samples;\n	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );\n	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );\n}", Yu = [
	/*@__PURE__*/ new W(1, 0, 0),
	/*@__PURE__*/ new W(-1, 0, 0),
	/*@__PURE__*/ new W(0, 1, 0),
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, 0, 1),
	/*@__PURE__*/ new W(0, 0, -1)
], Xu = [
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, 0, 1),
	/*@__PURE__*/ new W(0, 0, -1),
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, -1, 0)
], Zu = /*@__PURE__*/ new q(), Qu = /*@__PURE__*/ new W(), $u = /*@__PURE__*/ new W();
function ed(e, t, n) {
	let r = new ji(), i = new U(), a = new U(), s = new qt(), c = new mo(), u = new ho(), d = {}, f = n.maxTextureSize, p = {
		0: 1,
		1: 0,
		2: 2
	}, m = new co({
		defines: { VSM_SAMPLES: 8 },
		uniforms: {
			shadow_pass: { value: null },
			resolution: { value: new U() },
			radius: { value: 4 }
		},
		vertexShader: qu,
		fragmentShader: Ju
	}), h = m.clone();
	h.defines.HORIZONTAL_PASS = 1;
	let g = new Or();
	g.setAttribute("position", new pr(new Float32Array([
		-1,
		-1,
		.5,
		3,
		-1,
		.5,
		-1,
		3,
		.5
	]), 3));
	let b = new ti(g, m), x = this;
	this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
	let S = this.type;
	this.render = function(t, n, c) {
		if (x.enabled === !1 || x.autoUpdate === !1 && x.needsUpdate === !1 || t.length === 0) return;
		this.type === 2 && (B("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."), this.type = 1);
		let u = e.getRenderTarget(), d = e.getActiveCubeFace(), p = e.getActiveMipmapLevel(), m = e.state;
		m.setBlending(0), m.buffers.depth.getReversed() === !0 ? m.buffers.color.setClear(0, 0, 0, 0) : m.buffers.color.setClear(1, 1, 1, 1), m.buffers.depth.setTest(!0), m.setScissorTest(!1);
		let h = S !== this.type;
		h && n.traverse(function(e) {
			e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e.needsUpdate = !0) : e.material.needsUpdate = !0);
		});
		for (let u = 0, d = t.length; u < d; u++) {
			let d = t[u], p = d.shadow;
			if (p === void 0) {
				B("WebGLShadowMap:", d, "has no shadow.");
				continue;
			}
			if (p.autoUpdate === !1 && p.needsUpdate === !1) continue;
			i.copy(p.mapSize);
			let g = p.getFrameExtents();
			i.multiply(g), a.copy(p.mapSize), (i.x > f || i.y > f) && (i.x > f && (a.x = Math.floor(f / g.x), i.x = a.x * g.x, p.mapSize.x = a.x), i.y > f && (a.y = Math.floor(f / g.y), i.y = a.y * g.y, p.mapSize.y = a.y));
			let b = e.state.buffers.depth.getReversed();
			if (p.camera._reversedDepth = b, p.map === null || h === !0) {
				if (p.map !== null && (p.map.depthTexture !== null && (p.map.depthTexture.dispose(), p.map.depthTexture = null), p.map.dispose()), this.type === 3) {
					if (d.isPointLight) {
						B("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
						continue;
					}
					p.map = new Yt(i.x, i.y, {
						format: ee,
						type: y,
						minFilter: l,
						magFilter: l,
						generateMipmaps: !1
					}), p.map.texture.name = d.name + ".shadowMap", p.map.depthTexture = new xa(i.x, i.y, v), p.map.depthTexture.name = d.name + ".shadowMapDepth", p.map.depthTexture.format = O, p.map.depthTexture.compareFunction = null, p.map.depthTexture.minFilter = o, p.map.depthTexture.magFilter = o;
				} else d.isPointLight ? (p.map = new jc(i.x), p.map.depthTexture = new Sa(i.x, _)) : (p.map = new Yt(i.x, i.y), p.map.depthTexture = new xa(i.x, i.y, _)), p.map.depthTexture.name = d.name + ".shadowMap", p.map.depthTexture.format = O, this.type === 1 ? (p.map.depthTexture.compareFunction = b ? 518 : 515, p.map.depthTexture.minFilter = l, p.map.depthTexture.magFilter = l) : (p.map.depthTexture.compareFunction = null, p.map.depthTexture.minFilter = o, p.map.depthTexture.magFilter = o);
				p.camera.updateProjectionMatrix();
			}
			p.map.isWebGLCubeRenderTarget !== !0 && (p.map.width !== i.x || p.map.height !== i.y) && p.map.setSize(i.x, i.y);
			let x = p.map.isWebGLCubeRenderTarget ? 6 : p.getViewportCount();
			d.isPointLight !== !0 && p.updateMatrices(d, c);
			for (let t = 0; t < x; t++) {
				let i = p.getCamera(t);
				if (d.isPointLight) {
					let e = p.camera, n = p.matrix, r = d.distance || e.far;
					r !== e.far && (e.far = r, e.updateProjectionMatrix()), Qu.setFromMatrixPosition(d.matrixWorld), e.position.copy(Qu), $u.copy(e.position), $u.add(Yu[t]), e.up.copy(Xu[t]), e.lookAt($u), e.updateMatrixWorld(), n.makeTranslation(-Qu.x, -Qu.y, -Qu.z), Zu.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), p._frustum.setFromProjectionMatrix(Zu, e.coordinateSystem, e.reversedDepth);
				}
				if (p.map.isWebGLCubeRenderTarget) e.setRenderTarget(p.map, t), e.clear();
				else {
					t === 0 && (e.setRenderTarget(p.map), e.clear());
					let n = p.getViewport(t);
					s.set(a.x * n.x, a.y * n.y, a.x * n.z, a.y * n.w), m.viewport(s);
				}
				r = p.getFrustum(t), T(n, c, i, d, this.type);
			}
			p.isPointLightShadow !== !0 && this.type === 3 && C(p, c), p.needsUpdate = !1;
		}
		S = this.type, x.needsUpdate = !1, e.setRenderTarget(u, d, p);
	};
	function C(n, r) {
		let a = t.update(b);
		m.defines.VSM_SAMPLES !== n.blurSamples && (m.defines.VSM_SAMPLES = n.blurSamples, h.defines.VSM_SAMPLES = n.blurSamples, m.needsUpdate = !0, h.needsUpdate = !0), n.mapPass === null ? n.mapPass = new Yt(i.x, i.y, {
			format: ee,
			type: y
		}) : (n.mapPass.width !== n.map.width || n.mapPass.height !== n.map.height) && n.mapPass.setSize(n.map.width, n.map.height), m.uniforms.shadow_pass.value = n.map.depthTexture, m.uniforms.resolution.value.set(n.map.width, n.map.height), m.uniforms.radius.value = n.radius, e.setRenderTarget(n.mapPass), e.clear(), e.renderBufferDirect(r, null, a, m, b, null), h.uniforms.shadow_pass.value = n.mapPass.texture, h.uniforms.resolution.value.set(n.map.width, n.map.height), h.uniforms.radius.value = n.radius, e.setRenderTarget(n.map), e.clear(), e.renderBufferDirect(r, null, a, h, b, null);
	}
	function w(t, n, r, i) {
		let a = null, o = r.isPointLight === !0 ? t.customDistanceMaterial : t.customDepthMaterial;
		if (o !== void 0) a = o;
		else if (a = r.isPointLight === !0 ? u : c, e.localClippingEnabled && n.clipShadows === !0 && Array.isArray(n.clippingPlanes) && n.clippingPlanes.length !== 0 || n.displacementMap && n.displacementScale !== 0 || n.alphaMap && n.alphaTest > 0 || n.map && n.alphaTest > 0 || n.alphaToCoverage === !0) {
			let e = a.uuid, t = n.uuid, r = d[e];
			r === void 0 && (r = {}, d[e] = r);
			let i = r[t];
			i === void 0 && (i = a.clone(), r[t] = i, n.addEventListener("dispose", E)), a = i;
		}
		if (a.visible = n.visible, a.wireframe = n.wireframe, i === 3 ? a.side = n.shadowSide === null ? n.side : n.shadowSide : a.side = n.shadowSide === null ? p[n.side] : n.shadowSide, a.alphaMap = n.alphaMap, a.alphaTest = n.alphaToCoverage === !0 ? .5 : n.alphaTest, a.map = n.map, a.clipShadows = n.clipShadows, a.clippingPlanes = n.clippingPlanes, a.clipIntersection = n.clipIntersection, a.displacementMap = n.displacementMap, a.displacementScale = n.displacementScale, a.displacementBias = n.displacementBias, a.wireframeLinewidth = n.wireframeLinewidth, a.linewidth = n.linewidth, r.isPointLight === !0 && a.isMeshDistanceMaterial === !0) {
			let t = e.properties.get(a);
			t.light = r;
		}
		return a;
	}
	function T(n, i, a, o, s) {
		if (n.visible === !1) return;
		if (n.layers.test(i.layers) && (n.isMesh || n.isLine || n.isPoints) && (n.castShadow || n.receiveShadow && s === 3) && (!n.frustumCulled || n.intersectsFrustum(r))) {
			n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse, n.matrixWorld);
			let r = t.update(n), c = n.material;
			if (Array.isArray(c)) {
				let t = r.groups;
				for (let l = 0, u = t.length; l < u; l++) {
					let u = t[l], d = c[u.materialIndex];
					if (d && d.visible) {
						let t = w(n, d, o, s);
						n.onBeforeShadow(e, n, i, a, r, t, u), e.renderBufferDirect(a, null, r, t, n, u), n.onAfterShadow(e, n, i, a, r, t, u);
					}
				}
			} else if (c.visible) {
				let t = w(n, c, o, s);
				n.onBeforeShadow(e, n, i, a, r, t, null), e.renderBufferDirect(a, null, r, t, n, null), n.onAfterShadow(e, n, i, a, r, t, null);
			}
		}
		let c = n.children;
		for (let e = 0, t = c.length; e < t; e++) T(c[e], i, a, o, s);
	}
	function E(e) {
		e.target.removeEventListener("dispose", E);
		for (let t in d) {
			let n = d[t], r = e.target.uuid;
			r in n && (n[r].dispose(), delete n[r]);
		}
	}
}
function td(e, t) {
	function n() {
		let t = !1, n = new qt(), r = null, i = new qt(0, 0, 0, 0);
		return {
			setMask: function(n) {
				r !== n && !t && (e.colorMask(n, n, n, n), r = n);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t, r, a, o, s) {
				s === !0 && (t *= o, r *= o, a *= o), n.set(t, r, a, o), i.equals(n) === !1 && (e.clearColor(t, r, a, o), i.copy(n));
			},
			reset: function() {
				t = !1, r = null, i.set(-1, 0, 0, 0);
			}
		};
	}
	function r() {
		let n = !1, r = !1, i = null, a = null, o = null;
		return {
			setReversed: function(e) {
				if (r !== e) {
					let n = t.get("EXT_clip_control");
					e ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT) : n.clipControlEXT(n.LOWER_LEFT_EXT, n.NEGATIVE_ONE_TO_ONE_EXT), r = e;
					let i = o;
					o = null, this.setClear(i);
				}
			},
			getReversed: function() {
				return r;
			},
			setTest: function(t) {
				t ? F(e.DEPTH_TEST) : le(e.DEPTH_TEST);
			},
			setMask: function(t) {
				i !== t && !n && (e.depthMask(t), i = t);
			},
			setFunc: function(t) {
				if (r && (t = nt[t]), a !== t) {
					switch (t) {
						case 0:
							e.depthFunc(e.NEVER);
							break;
						case 1:
							e.depthFunc(e.ALWAYS);
							break;
						case 2:
							e.depthFunc(e.LESS);
							break;
						case 3:
							e.depthFunc(e.LEQUAL);
							break;
						case 4:
							e.depthFunc(e.EQUAL);
							break;
						case 5:
							e.depthFunc(e.GEQUAL);
							break;
						case 6:
							e.depthFunc(e.GREATER);
							break;
						case 7:
							e.depthFunc(e.NOTEQUAL);
							break;
						default: e.depthFunc(e.LEQUAL);
					}
					a = t;
				}
			},
			setLocked: function(e) {
				n = e;
			},
			setClear: function(t) {
				o !== t && (o = t, r && (t = 1 - t), e.clearDepth(t));
			},
			reset: function() {
				n = !1, i = null, a = null, o = null, r = !1;
			}
		};
	}
	function i() {
		let t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
		return {
			setTest: function(n) {
				t || (n ? F(e.STENCIL_TEST) : le(e.STENCIL_TEST));
			},
			setMask: function(r) {
				n !== r && !t && (e.stencilMask(r), n = r);
			},
			setFunc: function(t, n, o) {
				(r !== t || i !== n || a !== o) && (e.stencilFunc(t, n, o), r = t, i = n, a = o);
			},
			setOp: function(t, n, r) {
				(o !== t || s !== n || c !== r) && (e.stencilOp(t, n, r), o = t, s = n, c = r);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t) {
				l !== t && (e.clearStencil(t), l = t);
			},
			reset: function() {
				t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
			}
		};
	}
	let a = new n(), o = new r(), s = new i(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), u = {}, d = {}, f = {}, p = /* @__PURE__ */ new WeakMap(), m = [], h = null, g = !1, _ = null, v = null, y = null, b = null, x = null, S = null, C = null, w = new J(0, 0, 0), T = 0, E = !1, D = null, O = null, k = null, A = null, j = null, ee = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS), te = !1, M = 0, ne = e.getParameter(e.VERSION);
	ne.indexOf("WebGL") === -1 ? ne.indexOf("OpenGL ES") !== -1 && (M = parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]), te = M >= 2) : (M = parseFloat(/^WebGL (\d)/.exec(ne)[1]), te = M >= 1);
	let N = null, re = {}, P = e.getParameter(e.SCISSOR_BOX), ie = e.getParameter(e.VIEWPORT), ae = new qt().fromArray(P), oe = new qt().fromArray(ie);
	function se(t, n, r, i) {
		let a = /* @__PURE__ */ new Uint8Array(4), o = e.createTexture();
		e.bindTexture(t, o), e.texParameteri(t, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(t, e.TEXTURE_MAG_FILTER, e.NEAREST);
		for (let o = 0; o < r; o++) t === e.TEXTURE_3D || t === e.TEXTURE_2D_ARRAY ? e.texImage3D(n, 0, e.RGBA, 1, 1, i, 0, e.RGBA, e.UNSIGNED_BYTE, a) : e.texImage2D(n + o, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, a);
		return o;
	}
	let ce = {};
	ce[e.TEXTURE_2D] = se(e.TEXTURE_2D, e.TEXTURE_2D, 1), ce[e.TEXTURE_CUBE_MAP] = se(e.TEXTURE_CUBE_MAP, e.TEXTURE_CUBE_MAP_POSITIVE_X, 6), ce[e.TEXTURE_2D_ARRAY] = se(e.TEXTURE_2D_ARRAY, e.TEXTURE_2D_ARRAY, 1, 1), ce[e.TEXTURE_3D] = se(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1), a.setClear(0, 0, 0, 1), o.setClear(1), s.setClear(0), F(e.DEPTH_TEST), o.setFunc(3), _e(!1), ve(1), F(e.CULL_FACE), he(0);
	function F(t) {
		u[t] !== !0 && (e.enable(t), u[t] = !0);
	}
	function le(t) {
		u[t] !== !1 && (e.disable(t), u[t] = !1);
	}
	function ue(t, n) {
		return f[t] !== n && (e.bindFramebuffer(t, n), f[t] = n, t === e.DRAW_FRAMEBUFFER && (f[e.FRAMEBUFFER] = n), t === e.FRAMEBUFFER && (f[e.DRAW_FRAMEBUFFER] = n), !0);
	}
	function de(t, n) {
		let r = m, i = !1;
		if (t) {
			r = p.get(n), r === void 0 && (r = [], p.set(n, r));
			let a = t.textures;
			if (r.length !== a.length || r[0] !== e.COLOR_ATTACHMENT0) {
				for (let t = 0, n = a.length; t < n; t++) r[t] = e.COLOR_ATTACHMENT0 + t;
				r.length = a.length, i = !0;
			}
		} else r[0] !== e.BACK && (r[0] = e.BACK, i = !0);
		i && e.drawBuffers(r);
	}
	function fe(t) {
		return h !== t && (e.useProgram(t), h = t, !0);
	}
	let pe = {
		100: e.FUNC_ADD,
		101: e.FUNC_SUBTRACT,
		102: e.FUNC_REVERSE_SUBTRACT
	};
	pe[103] = e.MIN, pe[104] = e.MAX;
	let me = {
		200: e.ZERO,
		201: e.ONE,
		202: e.SRC_COLOR,
		204: e.SRC_ALPHA,
		210: e.SRC_ALPHA_SATURATE,
		208: e.DST_COLOR,
		206: e.DST_ALPHA,
		203: e.ONE_MINUS_SRC_COLOR,
		205: e.ONE_MINUS_SRC_ALPHA,
		209: e.ONE_MINUS_DST_COLOR,
		207: e.ONE_MINUS_DST_ALPHA,
		211: e.CONSTANT_COLOR,
		212: e.ONE_MINUS_CONSTANT_COLOR,
		213: e.CONSTANT_ALPHA,
		214: e.ONE_MINUS_CONSTANT_ALPHA
	};
	function he(t, n, r, i, a, o, s, c, l, u) {
		if (t === 0) g === !0 && (le(e.BLEND), g = !1);
		else if (g === !1 && (F(e.BLEND), g = !0), t !== 5) {
			if (t !== _ || u !== E) {
				if ((v !== 100 || x !== 100) && (e.blendEquation(e.FUNC_ADD), v = 100, x = 100), u) switch (t) {
					case 1:
						e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFunc(e.ONE, e.ONE);
						break;
					case 3:
						e.blendFuncSeparate(e.ZERO, e.ONE_MINUS_SRC_COLOR, e.ZERO, e.ONE);
						break;
					case 4:
						e.blendFuncSeparate(e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA, e.ZERO, e.ONE);
						break;
					default: V("WebGLState: Invalid blending: ", t);
				}
				else switch (t) {
					case 1:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE, e.ONE, e.ONE);
						break;
					case 3:
						V("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
						break;
					case 4:
						V("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
						break;
					default: V("WebGLState: Invalid blending: ", t);
				}
				y = null, b = null, S = null, C = null, w.set(0, 0, 0), T = 0, _ = t, E = u;
			}
		} else a ||= n, o ||= r, s ||= i, (n !== v || a !== x) && (e.blendEquationSeparate(pe[n], pe[a]), v = n, x = a), (r !== y || i !== b || o !== S || s !== C) && (e.blendFuncSeparate(me[r], me[i], me[o], me[s]), y = r, b = i, S = o, C = s), (c.equals(w) === !1 || l !== T) && (e.blendColor(c.r, c.g, c.b, l), w.copy(c), T = l), _ = t, E = !1;
	}
	function ge(t, n) {
		t.side === 2 ? le(e.CULL_FACE) : F(e.CULL_FACE);
		let r = t.side === 1;
		n && (r = !r), _e(r), t.blending === 1 && t.transparent === !1 ? he(0) : he(t.blending, t.blendEquation, t.blendSrc, t.blendDst, t.blendEquationAlpha, t.blendSrcAlpha, t.blendDstAlpha, t.blendColor, t.blendAlpha, t.premultipliedAlpha), o.setFunc(t.depthFunc), o.setTest(t.depthTest), o.setMask(t.depthWrite), a.setMask(t.colorWrite);
		let i = t.stencilWrite;
		s.setTest(i), i && (s.setMask(t.stencilWriteMask), s.setFunc(t.stencilFunc, t.stencilRef, t.stencilFuncMask), s.setOp(t.stencilFail, t.stencilZFail, t.stencilZPass)), be(t.polygonOffset, t.polygonOffsetFactor, t.polygonOffsetUnits), t.alphaToCoverage === !0 ? F(e.SAMPLE_ALPHA_TO_COVERAGE) : le(e.SAMPLE_ALPHA_TO_COVERAGE);
	}
	function _e(t) {
		D !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), D = t);
	}
	function ve(t) {
		t === 0 ? le(e.CULL_FACE) : (F(e.CULL_FACE), t !== O && (t === 1 ? e.cullFace(e.BACK) : t === 2 ? e.cullFace(e.FRONT) : e.cullFace(e.FRONT_AND_BACK))), O = t;
	}
	function ye(t) {
		t !== k && (te && e.lineWidth(t), k = t);
	}
	function be(t, n, r) {
		t ? (F(e.POLYGON_OFFSET_FILL), (A !== n || j !== r) && (A = n, j = r, o.getReversed() && (n = -n), e.polygonOffset(n, r))) : le(e.POLYGON_OFFSET_FILL);
	}
	function xe(t) {
		t ? F(e.SCISSOR_TEST) : le(e.SCISSOR_TEST);
	}
	function Se(t) {
		t === void 0 && (t = e.TEXTURE0 + ee - 1), N !== t && (e.activeTexture(t), N = t);
	}
	function Ce(t, n, r) {
		r === void 0 && (r = N === null ? e.TEXTURE0 + ee - 1 : N);
		let i = re[r];
		i === void 0 && (i = {
			type: void 0,
			texture: void 0
		}, re[r] = i), (i.type !== t || i.texture !== n) && (N !== r && (e.activeTexture(r), N = r), e.bindTexture(t, n || ce[t]), i.type = t, i.texture = n);
	}
	function we() {
		let t = re[N];
		t !== void 0 && t.type !== void 0 && (e.bindTexture(t.type, null), t.type = void 0, t.texture = void 0);
	}
	function Te() {
		try {
			e.compressedTexImage2D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function Ee() {
		try {
			e.compressedTexImage3D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function De() {
		try {
			e.texSubImage2D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function Oe() {
		try {
			e.texSubImage3D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function ke() {
		try {
			e.compressedTexSubImage2D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function Ae() {
		try {
			e.compressedTexSubImage3D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function je() {
		try {
			e.texStorage2D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function Me() {
		try {
			e.texStorage3D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function I() {
		try {
			e.texImage2D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function Ne() {
		try {
			e.texImage3D(...arguments);
		} catch (e) {
			V("WebGLState:", e);
		}
	}
	function Pe(t) {
		return d[t] === void 0 ? e.getParameter(t) : d[t];
	}
	function Fe(t, n) {
		d[t] !== n && (e.pixelStorei(t, n), d[t] = n);
	}
	function L(t) {
		ae.equals(t) === !1 && (e.scissor(t.x, t.y, t.z, t.w), ae.copy(t));
	}
	function Ie(t) {
		oe.equals(t) === !1 && (e.viewport(t.x, t.y, t.z, t.w), oe.copy(t));
	}
	function R(t, n) {
		let r = l.get(n);
		r === void 0 && (r = /* @__PURE__ */ new WeakMap(), l.set(n, r));
		let i = r.get(t);
		i === void 0 && (i = e.getUniformBlockIndex(n, t.name), r.set(t, i));
	}
	function z(t, n) {
		let r = l.get(n).get(t);
		c.get(n) !== r && (e.uniformBlockBinding(n, r, t.__bindingPointIndex), c.set(n, r));
	}
	function Le() {
		e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.disable(e.SAMPLE_ALPHA_TO_COVERAGE), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO), e.blendColor(0, 0, 0, 0), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.depthMask(!0), e.depthFunc(e.LESS), o.setReversed(!1), e.clearDepth(1), e.stencilMask(4294967295), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.clearStencil(0), e.cullFace(e.BACK), e.frontFace(e.CCW), e.polygonOffset(0, 0), e.activeTexture(e.TEXTURE0), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), e.bindFramebuffer(e.READ_FRAMEBUFFER, null), e.useProgram(null), e.lineWidth(1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.pixelStorei(e.PACK_ROW_LENGTH, 0), e.pixelStorei(e.PACK_SKIP_PIXELS, 0), e.pixelStorei(e.PACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_ROW_LENGTH, 0), e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0), e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0), e.pixelStorei(e.UNPACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0), u = {}, d = {}, N = null, re = {}, f = {}, p = /* @__PURE__ */ new WeakMap(), m = [], h = null, g = !1, _ = null, v = null, y = null, b = null, x = null, S = null, C = null, w = new J(0, 0, 0), T = 0, E = !1, D = null, O = null, k = null, A = null, j = null, ae.set(0, 0, e.canvas.width, e.canvas.height), oe.set(0, 0, e.canvas.width, e.canvas.height), a.reset(), o.reset(), s.reset();
	}
	return {
		buffers: {
			color: a,
			depth: o,
			stencil: s
		},
		enable: F,
		disable: le,
		bindFramebuffer: ue,
		drawBuffers: de,
		useProgram: fe,
		setBlending: he,
		setMaterial: ge,
		setFlipSided: _e,
		setCullFace: ve,
		setLineWidth: ye,
		setPolygonOffset: be,
		setScissorTest: xe,
		activeTexture: Se,
		bindTexture: Ce,
		unbindTexture: we,
		compressedTexImage2D: Te,
		compressedTexImage3D: Ee,
		texImage2D: I,
		texImage3D: Ne,
		pixelStorei: Fe,
		getParameter: Pe,
		updateUBOMapping: R,
		uniformBlockBinding: z,
		texStorage2D: je,
		texStorage3D: Me,
		texSubImage2D: De,
		texSubImage3D: Oe,
		compressedTexSubImage2D: ke,
		compressedTexSubImage3D: Ae,
		scissor: L,
		viewport: Ie,
		reset: Le
	};
}
function nd(e, t, n, f, p, m, h) {
	let g = t.has("WEBGL_multisampled_render_to_texture") ? t.get("WEBGL_multisampled_render_to_texture") : null, _ = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), v = new U(), y = /* @__PURE__ */ new WeakMap(), b = /* @__PURE__ */ new Set(), x, S = /* @__PURE__ */ new WeakMap(), C = !1;
	try {
		C = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
	} catch {}
	function w(e, t) {
		return C ? new OffscreenCanvas(e, t) : Ye("canvas");
	}
	function T(e, t, n) {
		let r = 1, i = Pe(e);
		if ((i.width > n || i.height > n) && (r = n / Math.max(i.width, i.height)), r < 1) {
			if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof VideoFrame < "u" && e instanceof VideoFrame) {
				let n = Math.floor(r * i.width), a = Math.floor(r * i.height);
				x === void 0 && (x = w(n, a));
				let o = t ? w(n, a) : x;
				return o.width = n, o.height = a, o.getContext("2d").drawImage(e, 0, 0, n, a), B("WebGLRenderer: Texture has been resized from (" + i.width + "x" + i.height + ") to (" + n + "x" + a + ")."), o;
			}
			return "data" in e && B("WebGLRenderer: Image in DataTexture is too big (" + i.width + "x" + i.height + ")."), e;
		}
		return e;
	}
	function E(e) {
		return e.generateMipmaps;
	}
	function D(t) {
		e.generateMipmap(t);
	}
	function O(t) {
		return t.isWebGLCubeRenderTarget ? e.TEXTURE_CUBE_MAP : t.isWebGL3DRenderTarget ? e.TEXTURE_3D : t.isWebGLArrayRenderTarget || t.isCompressedArrayTexture ? e.TEXTURE_2D_ARRAY : e.TEXTURE_2D;
	}
	function A(n, r, i, a, o, s = !1) {
		if (n !== null) {
			if (e[n] !== void 0) return e[n];
			B("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + n + "'");
		}
		let c;
		a && (c = t.get("EXT_texture_norm16"), c || B("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
		let l = r;
		if (r === e.RED && (i === e.FLOAT && (l = e.R32F), i === e.HALF_FLOAT && (l = e.R16F), i === e.UNSIGNED_BYTE && (l = e.R8), i === e.UNSIGNED_SHORT && c && (l = c.R16_EXT), i === e.SHORT && c && (l = c.R16_SNORM_EXT)), r === e.RED_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.R8UI), i === e.UNSIGNED_SHORT && (l = e.R16UI), i === e.UNSIGNED_INT && (l = e.R32UI), i === e.BYTE && (l = e.R8I), i === e.SHORT && (l = e.R16I), i === e.INT && (l = e.R32I)), r === e.RG && (i === e.FLOAT && (l = e.RG32F), i === e.HALF_FLOAT && (l = e.RG16F), i === e.UNSIGNED_BYTE && (l = e.RG8), i === e.UNSIGNED_SHORT && c && (l = c.RG16_EXT), i === e.SHORT && c && (l = c.RG16_SNORM_EXT)), r === e.RG_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.RG8UI), i === e.UNSIGNED_SHORT && (l = e.RG16UI), i === e.UNSIGNED_INT && (l = e.RG32UI), i === e.BYTE && (l = e.RG8I), i === e.SHORT && (l = e.RG16I), i === e.INT && (l = e.RG32I)), r === e.RGB_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.RGB8UI), i === e.UNSIGNED_SHORT && (l = e.RGB16UI), i === e.UNSIGNED_INT && (l = e.RGB32UI), i === e.BYTE && (l = e.RGB8I), i === e.SHORT && (l = e.RGB16I), i === e.INT && (l = e.RGB32I)), r === e.RGBA_INTEGER && (i === e.UNSIGNED_BYTE && (l = e.RGBA8UI), i === e.UNSIGNED_SHORT && (l = e.RGBA16UI), i === e.UNSIGNED_INT && (l = e.RGBA32UI), i === e.BYTE && (l = e.RGBA8I), i === e.SHORT && (l = e.RGBA16I), i === e.INT && (l = e.RGBA32I)), r === e.RGB && (i === e.UNSIGNED_SHORT && c && (l = c.RGB16_EXT), i === e.SHORT && c && (l = c.RGB16_SNORM_EXT), i === e.UNSIGNED_INT_5_9_9_9_REV && (l = e.RGB9_E5), i === e.UNSIGNED_INT_10F_11F_11F_REV && (l = e.R11F_G11F_B10F)), r === e.RGBA) {
			let t = s ? He : K.getTransfer(o);
			i === e.FLOAT && (l = e.RGBA32F), i === e.HALF_FLOAT && (l = e.RGBA16F), i === e.UNSIGNED_BYTE && (l = t === "srgb" ? e.SRGB8_ALPHA8 : e.RGBA8), i === e.UNSIGNED_SHORT && c && (l = c.RGBA16_EXT), i === e.SHORT && c && (l = c.RGBA16_SNORM_EXT), i === e.UNSIGNED_SHORT_4_4_4_4 && (l = e.RGBA4), i === e.UNSIGNED_SHORT_5_5_5_1 && (l = e.RGB5_A1);
		}
		return (l === e.R16F || l === e.R32F || l === e.RG16F || l === e.RG32F || l === e.RGBA16F || l === e.RGBA32F) && t.get("EXT_color_buffer_float"), l;
	}
	function j(t, n) {
		let r;
		return t ? n === null || n === 1014 || n === 1020 ? r = e.DEPTH24_STENCIL8 : n === 1015 ? r = e.DEPTH32F_STENCIL8 : n === 1012 && (r = e.DEPTH24_STENCIL8, B("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : n === null || n === 1014 || n === 1020 ? r = e.DEPTH_COMPONENT24 : n === 1015 ? r = e.DEPTH_COMPONENT32F : n === 1012 && (r = e.DEPTH_COMPONENT16), r;
	}
	function ee(e, t) {
		return E(e) === !0 || e.isFramebufferTexture && e.minFilter !== 1003 && e.minFilter !== 1006 ? Math.log2(Math.max(t.width, t.height)) + 1 : e.mipmaps !== void 0 && e.mipmaps.length > 0 ? e.mipmaps.length : e.isCompressedTexture && Array.isArray(e.image) ? t.mipmaps.length : 1;
	}
	function te(e) {
		let t = e.target;
		t.removeEventListener("dispose", te), ne(t), t.isVideoTexture && y.delete(t), t.isHTMLTexture && b.delete(t);
	}
	function M(e) {
		let t = e.target;
		t.removeEventListener("dispose", M), re(t);
	}
	function ne(e) {
		let t = f.get(e);
		if (t.__webglInit === void 0) return;
		let n = e.source, r = S.get(n);
		if (r) {
			let i = r[t.__cacheKey];
			i.usedTimes--, i.usedTimes === 0 && N(e), Object.keys(r).length === 0 && S.delete(n);
		}
		f.remove(e);
	}
	function N(t) {
		let n = f.get(t);
		e.deleteTexture(n.__webglTexture);
		let r = t.source, i = S.get(r);
		delete i[n.__cacheKey], h.memory.textures--;
	}
	function re(t) {
		let n = f.get(t);
		if (t.depthTexture && (t.depthTexture.dispose(), f.remove(t.depthTexture)), t.isWebGLCubeRenderTarget) for (let t = 0; t < 6; t++) {
			if (Array.isArray(n.__webglFramebuffer[t])) for (let r = 0; r < n.__webglFramebuffer[t].length; r++) e.deleteFramebuffer(n.__webglFramebuffer[t][r]);
			else e.deleteFramebuffer(n.__webglFramebuffer[t]);
			n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer[t]);
		}
		else {
			if (Array.isArray(n.__webglFramebuffer)) for (let t = 0; t < n.__webglFramebuffer.length; t++) e.deleteFramebuffer(n.__webglFramebuffer[t]);
			else e.deleteFramebuffer(n.__webglFramebuffer);
			if (n.__webglDepthbuffer && e.deleteRenderbuffer(n.__webglDepthbuffer), n.__webglMultisampledFramebuffer && e.deleteFramebuffer(n.__webglMultisampledFramebuffer), n.__webglColorRenderbuffer) for (let t = 0; t < n.__webglColorRenderbuffer.length; t++) n.__webglColorRenderbuffer[t] && e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);
			n.__webglDepthRenderbuffer && e.deleteRenderbuffer(n.__webglDepthRenderbuffer);
		}
		let r = t.textures;
		for (let t = 0, n = r.length; t < n; t++) {
			let n = f.get(r[t]);
			n.__webglTexture && (e.deleteTexture(n.__webglTexture), h.memory.textures--), f.remove(r[t]);
		}
		f.remove(t);
	}
	let P = 0;
	function ie() {
		P = 0;
	}
	function ae() {
		return P;
	}
	function oe(e) {
		P = e;
	}
	function se() {
		let e = P;
		return e >= p.maxTextures && B("WebGLTextures: Trying to use " + (e + 1) + " texture units while this GPU supports only " + p.maxTextures), P += 1, e;
	}
	function ce(e) {
		let t = [];
		return t.push(e.wrapS), t.push(e.wrapT), t.push(e.wrapR || 0), t.push(e.magFilter), t.push(e.minFilter), t.push(e.anisotropy), t.push(e.internalFormat), t.push(e.format), t.push(e.type), t.push(e.generateMipmaps), t.push(e.premultiplyAlpha), t.push(e.flipY), t.push(e.unpackAlignment), t.push(e.colorSpace), t.join();
	}
	function F(t, r) {
		let i = f.get(t);
		if (t.isVideoTexture && I(t), t.isRenderTargetTexture === !1 && t.isExternalTexture !== !0 && t.version > 0 && i.__version !== t.version) {
			let e = t.image;
			if (e === null) B("WebGLRenderer: Texture marked for update but no image data found.");
			else if (e.complete === !1) B("WebGLRenderer: Texture marked for update but image is incomplete");
			else {
				ye(i, t, r);
				return;
			}
		} else t.isExternalTexture && (i.__webglTexture = t.sourceTexture ? t.sourceTexture : null);
		n.bindTexture(e.TEXTURE_2D, i.__webglTexture, e.TEXTURE0 + r);
	}
	function le(t, r) {
		let i = f.get(t);
		t.isRenderTargetTexture === !1 && t.version > 0 && i.__version !== t.version ? ye(i, t, r) : (t.isExternalTexture && (i.__webglTexture = t.sourceTexture ? t.sourceTexture : null), n.bindTexture(e.TEXTURE_2D_ARRAY, i.__webglTexture, e.TEXTURE0 + r));
	}
	function ue(t, r) {
		let i = f.get(t);
		t.isRenderTargetTexture === !1 && t.version > 0 && i.__version !== t.version ? ye(i, t, r) : n.bindTexture(e.TEXTURE_3D, i.__webglTexture, e.TEXTURE0 + r);
	}
	function de(t, r) {
		let i = f.get(t);
		t.isCubeDepthTexture !== !0 && t.version > 0 && i.__version !== t.version ? be(i, t, r) : n.bindTexture(e.TEXTURE_CUBE_MAP, i.__webglTexture, e.TEXTURE0 + r);
	}
	let fe = {
		[r]: e.REPEAT,
		[i]: e.CLAMP_TO_EDGE,
		[a]: e.MIRRORED_REPEAT
	}, pe = {
		[o]: e.NEAREST,
		[s]: e.NEAREST_MIPMAP_NEAREST,
		[c]: e.NEAREST_MIPMAP_LINEAR,
		[l]: e.LINEAR,
		[u]: e.LINEAR_MIPMAP_NEAREST,
		[d]: e.LINEAR_MIPMAP_LINEAR
	}, me = {
		512: e.NEVER,
		519: e.ALWAYS,
		513: e.LESS,
		515: e.LEQUAL,
		514: e.EQUAL,
		518: e.GEQUAL,
		516: e.GREATER,
		517: e.NOTEQUAL
	};
	function he(n, r) {
		if (r.type === 1015 && t.has("OES_texture_float_linear") === !1 && (r.magFilter === 1006 || r.magFilter === 1007 || r.magFilter === 1005 || r.magFilter === 1008 || r.minFilter === 1006 || r.minFilter === 1007 || r.minFilter === 1005 || r.minFilter === 1008) && B("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), e.texParameteri(n, e.TEXTURE_WRAP_S, fe[r.wrapS]), e.texParameteri(n, e.TEXTURE_WRAP_T, fe[r.wrapT]), (n === e.TEXTURE_3D || n === e.TEXTURE_2D_ARRAY) && e.texParameteri(n, e.TEXTURE_WRAP_R, fe[r.wrapR]), e.texParameteri(n, e.TEXTURE_MAG_FILTER, pe[r.magFilter]), e.texParameteri(n, e.TEXTURE_MIN_FILTER, pe[r.minFilter]), r.compareFunction && (e.texParameteri(n, e.TEXTURE_COMPARE_MODE, e.COMPARE_REF_TO_TEXTURE), e.texParameteri(n, e.TEXTURE_COMPARE_FUNC, me[r.compareFunction])), t.has("EXT_texture_filter_anisotropic") === !0) {
			if (r.magFilter === 1003 || r.minFilter !== 1005 && r.minFilter !== 1008 || r.type === 1015 && t.has("OES_texture_float_linear") === !1) return;
			if (r.anisotropy > 1 || f.get(r).__currentAnisotropy) {
				let i = t.get("EXT_texture_filter_anisotropic");
				e.texParameterf(n, i.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(r.anisotropy, p.getMaxAnisotropy())), f.get(r).__currentAnisotropy = r.anisotropy;
			}
		}
	}
	function ge(t, n) {
		let r = !1;
		t.__webglInit === void 0 && (t.__webglInit = !0, n.addEventListener("dispose", te));
		let i = n.source, a = S.get(i);
		a === void 0 && (a = {}, S.set(i, a));
		let o = ce(n);
		if (o !== t.__cacheKey) {
			a[o] === void 0 && (a[o] = {
				texture: e.createTexture(),
				usedTimes: 0
			}, h.memory.textures++, r = !0), a[o].usedTimes++;
			let i = a[t.__cacheKey];
			i !== void 0 && (a[t.__cacheKey].usedTimes--, i.usedTimes === 0 && N(n)), t.__cacheKey = o, t.__webglTexture = a[o].texture;
		}
		return r;
	}
	function _e(e, t, n) {
		return Math.floor(Math.floor(e / n) / t);
	}
	function ve(t, r, i, a) {
		let o = t.updateRanges;
		if (o.length === 0) n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r.width, r.height, i, a, r.data);
		else {
			o.sort((e, t) => e.start - t.start);
			let s = 0;
			for (let e = 1; e < o.length; e++) {
				let t = o[s], n = o[e], i = t.start + t.count, a = _e(n.start, r.width, 4), c = _e(t.start, r.width, 4);
				n.start <= i + 1 && a === c && _e(n.start + n.count - 1, r.width, 4) === a ? t.count = Math.max(t.count, n.start + n.count - t.start) : (++s, o[s] = n);
			}
			o.length = s + 1;
			let c = n.getParameter(e.UNPACK_ROW_LENGTH), l = n.getParameter(e.UNPACK_SKIP_PIXELS), u = n.getParameter(e.UNPACK_SKIP_ROWS);
			n.pixelStorei(e.UNPACK_ROW_LENGTH, r.width);
			for (let t = 0, s = o.length; t < s; t++) {
				let s = o[t], c = Math.floor(s.start / 4), l = Math.ceil(s.count / 4), u = c % r.width, d = Math.floor(c / r.width), f = l;
				n.pixelStorei(e.UNPACK_SKIP_PIXELS, u), n.pixelStorei(e.UNPACK_SKIP_ROWS, d), n.texSubImage2D(e.TEXTURE_2D, 0, u, d, f, 1, i, a, r.data);
			}
			t.clearUpdateRanges(), n.pixelStorei(e.UNPACK_ROW_LENGTH, c), n.pixelStorei(e.UNPACK_SKIP_PIXELS, l), n.pixelStorei(e.UNPACK_SKIP_ROWS, u);
		}
	}
	function ye(t, r, i) {
		let a = e.TEXTURE_2D;
		(r.isDataArrayTexture || r.isCompressedArrayTexture) && (a = e.TEXTURE_2D_ARRAY), r.isData3DTexture && (a = e.TEXTURE_3D);
		let o = ge(t, r), s = r.source;
		n.bindTexture(a, t.__webglTexture, e.TEXTURE0 + i);
		let c = f.get(s);
		if (s.version !== c.__version || o === !0) {
			if (n.activeTexture(e.TEXTURE0 + i), !(typeof ImageBitmap < "u" && r.image instanceof ImageBitmap)) {
				let t = K.getPrimaries(K.workingColorSpace), i = r.colorSpace === "" ? null : K.getPrimaries(r.colorSpace), a = r.colorSpace === "" || t === i ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
				n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, r.flipY), n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r.premultiplyAlpha), n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, a);
			}
			n.pixelStorei(e.UNPACK_ALIGNMENT, r.unpackAlignment);
			let t = T(r.image, !1, p.maxTextureSize);
			t = Ne(r, t);
			let l = m.convert(r.format, r.colorSpace), u = m.convert(r.type), d = A(r.internalFormat, l, u, r.normalized, r.colorSpace, r.isVideoTexture);
			he(a, r);
			let f, h = r.mipmaps, g = r.isVideoTexture !== !0, _ = c.__version === void 0 || o === !0, v = s.dataReady, y = ee(r, t);
			if (r.isDepthTexture) d = j(r.format === k, r.type), _ && (g ? n.texStorage2D(e.TEXTURE_2D, 1, d, t.width, t.height) : n.texImage2D(e.TEXTURE_2D, 0, d, t.width, t.height, 0, l, u, null));
			else if (r.isDataTexture) {
				if (h.length > 0) {
					g && _ && n.texStorage2D(e.TEXTURE_2D, y, d, h[0].width, h[0].height);
					for (let t = 0, r = h.length; t < r; t++) f = h[t], g ? v && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, f.width, f.height, l, u, f.data) : n.texImage2D(e.TEXTURE_2D, t, d, f.width, f.height, 0, l, u, f.data);
					r.generateMipmaps = !1;
				} else g ? (_ && n.texStorage2D(e.TEXTURE_2D, y, d, t.width, t.height), v && ve(r, t, l, u)) : n.texImage2D(e.TEXTURE_2D, 0, d, t.width, t.height, 0, l, u, t.data);
			} else if (r.isCompressedTexture) {
				if (r.isCompressedArrayTexture) {
					g && _ && n.texStorage3D(e.TEXTURE_2D_ARRAY, y, d, h[0].width, h[0].height, t.depth);
					for (let i = 0, a = h.length; i < a; i++) if (f = h[i], r.format !== 1023) {
						if (l !== null) {
							if (g) {
								if (v) {
									if (r.layerUpdates.size > 0) {
										let t = Zs(f.width, f.height, r.format, r.type);
										for (let a of r.layerUpdates) {
											let r = f.data.subarray(a * t / f.data.BYTES_PER_ELEMENT, (a + 1) * t / f.data.BYTES_PER_ELEMENT);
											n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, a, f.width, f.height, 1, l, r);
										}
									} else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, 0, f.width, f.height, t.depth, l, f.data);
								}
							} else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY, i, d, f.width, f.height, t.depth, 0, f.data, 0, 0);
						} else B("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
					} else g ? v && n.texSubImage3D(e.TEXTURE_2D_ARRAY, i, 0, 0, 0, f.width, f.height, t.depth, l, u, f.data) : n.texImage3D(e.TEXTURE_2D_ARRAY, i, d, f.width, f.height, t.depth, 0, l, u, f.data);
					r.layerUpdates.size > 0 && r.clearLayerUpdates();
				} else {
					g && _ && n.texStorage2D(e.TEXTURE_2D, y, d, h[0].width, h[0].height);
					for (let t = 0, i = h.length; t < i; t++) f = h[t], r.format === 1023 ? g ? v && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, f.width, f.height, l, u, f.data) : n.texImage2D(e.TEXTURE_2D, t, d, f.width, f.height, 0, l, u, f.data) : l === null ? B("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : g ? v && n.compressedTexSubImage2D(e.TEXTURE_2D, t, 0, 0, f.width, f.height, l, f.data) : n.compressedTexImage2D(e.TEXTURE_2D, t, d, f.width, f.height, 0, f.data);
				}
			} else if (r.isDataArrayTexture) {
				if (g) {
					if (_ && n.texStorage3D(e.TEXTURE_2D_ARRAY, y, d, t.width, t.height, t.depth), v) {
						if (r.layerUpdates.size > 0) {
							let i = Zs(t.width, t.height, r.format, r.type);
							for (let a of r.layerUpdates) {
								let r = t.data.subarray(a * i / t.data.BYTES_PER_ELEMENT, (a + 1) * i / t.data.BYTES_PER_ELEMENT);
								n.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, a, t.width, t.height, 1, l, u, r);
							}
							r.clearLayerUpdates();
						} else n.texSubImage3D(e.TEXTURE_2D_ARRAY, 0, 0, 0, 0, t.width, t.height, t.depth, l, u, t.data);
					}
				} else n.texImage3D(e.TEXTURE_2D_ARRAY, 0, d, t.width, t.height, t.depth, 0, l, u, t.data);
			} else if (r.isData3DTexture) g ? (_ && n.texStorage3D(e.TEXTURE_3D, y, d, t.width, t.height, t.depth), v && n.texSubImage3D(e.TEXTURE_3D, 0, 0, 0, 0, t.width, t.height, t.depth, l, u, t.data)) : n.texImage3D(e.TEXTURE_3D, 0, d, t.width, t.height, t.depth, 0, l, u, t.data);
			else if (r.isFramebufferTexture) {
				if (_) {
					if (g) n.texStorage2D(e.TEXTURE_2D, y, d, t.width, t.height);
					else {
						let r = t.width, i = t.height;
						for (let t = 0; t < y; t++) n.texImage2D(e.TEXTURE_2D, t, d, r, i, 0, l, u, null), r >>= 1, i >>= 1;
					}
				}
			} else if (r.isHTMLTexture) {
				if ("texElementImage2D" in e) {
					let n = e.canvas;
					if (n.hasAttribute("layoutsubtree") || n.setAttribute("layoutsubtree", "true"), t.parentNode !== n) {
						n.appendChild(t), b.add(r), n.onpaint = (e) => {
							let t = e.changedElements;
							for (let e of b) t.includes(e.image) && (e.needsUpdate = !0);
						}, n.requestPaint();
						return;
					}
					if (e.texElementImage2D.length === 3) e.texElementImage2D(e.TEXTURE_2D, e.RGBA8, t);
					else {
						let n = e.RGBA, r = e.RGBA, i = e.UNSIGNED_BYTE;
						e.texElementImage2D(e.TEXTURE_2D, 0, n, r, i, t);
					}
					e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
				}
			} else if (h.length > 0) {
				if (g && _) {
					let t = Pe(h[0]);
					n.texStorage2D(e.TEXTURE_2D, y, d, t.width, t.height);
				}
				for (let t = 0, r = h.length; t < r; t++) f = h[t], g ? v && n.texSubImage2D(e.TEXTURE_2D, t, 0, 0, l, u, f) : n.texImage2D(e.TEXTURE_2D, t, d, l, u, f);
				r.generateMipmaps = !1;
			} else if (g) {
				if (_) {
					let r = Pe(t);
					n.texStorage2D(e.TEXTURE_2D, y, d, r.width, r.height);
				}
				v && n.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, l, u, t);
			} else n.texImage2D(e.TEXTURE_2D, 0, d, l, u, t);
			E(r) && D(a), c.__version = s.version, r.onUpdate && r.onUpdate(r);
		}
		t.__version = r.version;
	}
	function be(t, r, i) {
		if (r.image.length !== 6) return;
		let a = ge(t, r), o = r.source;
		n.bindTexture(e.TEXTURE_CUBE_MAP, t.__webglTexture, e.TEXTURE0 + i);
		let s = f.get(o);
		if (o.version !== s.__version || a === !0) {
			n.activeTexture(e.TEXTURE0 + i);
			let t = K.getPrimaries(K.workingColorSpace), c = r.colorSpace === "" ? null : K.getPrimaries(r.colorSpace), l = r.colorSpace === "" || t === c ? e.NONE : e.BROWSER_DEFAULT_WEBGL;
			n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, r.flipY), n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r.premultiplyAlpha), n.pixelStorei(e.UNPACK_ALIGNMENT, r.unpackAlignment), n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, l);
			let u = r.isCompressedTexture || r.image[0].isCompressedTexture, d = r.image[0] && r.image[0].isDataTexture, f = [];
			for (let e = 0; e < 6; e++) !u && !d ? f[e] = T(r.image[e], !0, p.maxCubemapSize) : f[e] = d ? r.image[e].image : r.image[e], f[e] = Ne(r, f[e]);
			let h = f[0], g = m.convert(r.format, r.colorSpace), _ = m.convert(r.type), v = A(r.internalFormat, g, _, r.normalized, r.colorSpace), y = r.isVideoTexture !== !0, b = s.__version === void 0 || a === !0, x = o.dataReady, S = ee(r, h);
			he(e.TEXTURE_CUBE_MAP, r);
			let C;
			if (u) {
				y && b && n.texStorage2D(e.TEXTURE_CUBE_MAP, S, v, h.width, h.height);
				for (let t = 0; t < 6; t++) {
					C = f[t].mipmaps;
					for (let i = 0; i < C.length; i++) {
						let a = C[i];
						r.format === 1023 ? y ? x && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, i, 0, 0, a.width, a.height, g, _, a.data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, i, v, a.width, a.height, 0, g, _, a.data) : g === null ? B("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : y ? x && n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, i, 0, 0, a.width, a.height, g, a.data) : n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, i, v, a.width, a.height, 0, a.data);
					}
				}
			} else {
				if (C = r.mipmaps, y && b) {
					C.length > 0 && S++;
					let t = Pe(f[0]);
					n.texStorage2D(e.TEXTURE_CUBE_MAP, S, v, t.width, t.height);
				}
				for (let t = 0; t < 6; t++) if (d) {
					y ? x && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, 0, 0, f[t].width, f[t].height, g, _, f[t].data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, v, f[t].width, f[t].height, 0, g, _, f[t].data);
					for (let r = 0; r < C.length; r++) {
						let i = C[r].image[t].image;
						y ? x && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, 0, 0, i.width, i.height, g, _, i.data) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, v, i.width, i.height, 0, g, _, i.data);
					}
				} else {
					y ? x && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, 0, 0, g, _, f[t]) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, 0, v, g, _, f[t]);
					for (let r = 0; r < C.length; r++) {
						let i = C[r];
						y ? x && n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, 0, 0, g, _, i.image[t]) : n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + t, r + 1, v, g, _, i.image[t]);
					}
				}
			}
			E(r) && D(e.TEXTURE_CUBE_MAP), s.__version = o.version, r.onUpdate && r.onUpdate(r);
		}
		t.__version = r.version;
	}
	function xe(t, r, i, a, o, s) {
		let c = m.convert(i.format, i.colorSpace), l = m.convert(i.type), u = A(i.internalFormat, c, l, i.normalized, i.colorSpace), d = f.get(r), p = f.get(i);
		if (p.__renderTarget = r, !d.__hasExternalTextures) {
			let t = Math.max(1, r.width >> s), i = Math.max(1, r.height >> s);
			o === e.TEXTURE_3D || o === e.TEXTURE_2D_ARRAY ? n.texImage3D(o, s, u, t, i, r.depth, 0, c, l, null) : n.texImage2D(o, s, u, t, i, 0, c, l, null);
		}
		n.bindFramebuffer(e.FRAMEBUFFER, t), Me(r) ? g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, a, o, p.__webglTexture, 0, je(r)) : (o === e.TEXTURE_2D || o >= e.TEXTURE_CUBE_MAP_POSITIVE_X && o <= e.TEXTURE_CUBE_MAP_NEGATIVE_Z) && e.framebufferTexture2D(e.FRAMEBUFFER, a, o, p.__webglTexture, s), n.bindFramebuffer(e.FRAMEBUFFER, null);
	}
	function Se(t, n, r) {
		if (e.bindRenderbuffer(e.RENDERBUFFER, t), n.depthBuffer) {
			let i = n.depthTexture, a = i && i.isDepthTexture ? i.type : null, o = j(n.stencilBuffer, a), s = n.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
			Me(n) ? g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, je(n), o, n.width, n.height) : r ? e.renderbufferStorageMultisample(e.RENDERBUFFER, je(n), o, n.width, n.height) : e.renderbufferStorage(e.RENDERBUFFER, o, n.width, n.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, s, e.RENDERBUFFER, t);
		} else {
			let t = n.textures;
			for (let i = 0; i < t.length; i++) {
				let a = t[i], o = m.convert(a.format, a.colorSpace), s = m.convert(a.type), c = A(a.internalFormat, o, s, a.normalized, a.colorSpace);
				Me(n) ? g.renderbufferStorageMultisampleEXT(e.RENDERBUFFER, je(n), c, n.width, n.height) : r ? e.renderbufferStorageMultisample(e.RENDERBUFFER, je(n), c, n.width, n.height) : e.renderbufferStorage(e.RENDERBUFFER, c, n.width, n.height);
			}
		}
		e.bindRenderbuffer(e.RENDERBUFFER, null);
	}
	function Ce(t, r, i) {
		let a = r.isWebGLCubeRenderTarget === !0;
		if (n.bindFramebuffer(e.FRAMEBUFFER, t), !(r.depthTexture && r.depthTexture.isDepthTexture)) throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");
		let o = f.get(r.depthTexture);
		if (o.__renderTarget = r, o.__webglTexture && r.depthTexture.image.width === r.width && r.depthTexture.image.height === r.height || (r.depthTexture.image.width = r.width, r.depthTexture.image.height = r.height, r.depthTexture.needsUpdate = !0), a) {
			if (o.__webglInit === void 0 && (o.__webglInit = !0, r.depthTexture.addEventListener("dispose", te)), o.__webglTexture === void 0) {
				o.__webglTexture = e.createTexture(), n.bindTexture(e.TEXTURE_CUBE_MAP, o.__webglTexture), he(e.TEXTURE_CUBE_MAP, r.depthTexture);
				let t = m.convert(r.depthTexture.format), i = m.convert(r.depthTexture.type), a;
				r.depthTexture.format === 1026 ? a = e.DEPTH_COMPONENT24 : r.depthTexture.format === 1027 && (a = e.DEPTH24_STENCIL8);
				for (let n = 0; n < 6; n++) e.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0, a, r.width, r.height, 0, t, i, null);
			}
		} else F(r.depthTexture, 0);
		let s = o.__webglTexture, c = je(r), l = a ? e.TEXTURE_CUBE_MAP_POSITIVE_X + i : e.TEXTURE_2D, u = r.depthTexture.format === 1027 ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
		if (r.depthTexture.format === 1026) Me(r) ? g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, u, l, s, 0, c) : e.framebufferTexture2D(e.FRAMEBUFFER, u, l, s, 0);
		else if (r.depthTexture.format === 1027) Me(r) ? g.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER, u, l, s, 0, c) : e.framebufferTexture2D(e.FRAMEBUFFER, u, l, s, 0);
		else throw Error("THREE.WebGLTextures: Unknown depthTexture format.");
	}
	function we(t) {
		let r = f.get(t), i = t.isWebGLCubeRenderTarget === !0;
		if (r.__boundDepthTexture !== t.depthTexture) {
			let e = t.depthTexture;
			if (r.__depthDisposeCallback && r.__depthDisposeCallback(), e) {
				let t = () => {
					delete r.__boundDepthTexture, delete r.__depthDisposeCallback, e.removeEventListener("dispose", t);
				};
				e.addEventListener("dispose", t), r.__depthDisposeCallback = t;
			}
			r.__boundDepthTexture = e;
		}
		if (t.depthTexture && !r.__autoAllocateDepthBuffer) {
			if (i) for (let e = 0; e < 6; e++) Ce(r.__webglFramebuffer[e], t, e);
			else {
				let e = t.texture.mipmaps;
				e && e.length > 0 ? Ce(r.__webglFramebuffer[0], t, 0) : Ce(r.__webglFramebuffer, t, 0);
			}
		} else if (i) {
			r.__webglDepthbuffer = [];
			for (let i = 0; i < 6; i++) if (n.bindFramebuffer(e.FRAMEBUFFER, r.__webglFramebuffer[i]), r.__webglDepthbuffer[i] === void 0) r.__webglDepthbuffer[i] = e.createRenderbuffer(), Se(r.__webglDepthbuffer[i], t, !1);
			else {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, a = r.__webglDepthbuffer[i];
				e.bindRenderbuffer(e.RENDERBUFFER, a), e.framebufferRenderbuffer(e.FRAMEBUFFER, n, e.RENDERBUFFER, a);
			}
		} else {
			let i = t.texture.mipmaps;
			if (i && i.length > 0 ? n.bindFramebuffer(e.FRAMEBUFFER, r.__webglFramebuffer[0]) : n.bindFramebuffer(e.FRAMEBUFFER, r.__webglFramebuffer), r.__webglDepthbuffer === void 0) r.__webglDepthbuffer = e.createRenderbuffer(), Se(r.__webglDepthbuffer, t, !1);
			else {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, i = r.__webglDepthbuffer;
				e.bindRenderbuffer(e.RENDERBUFFER, i), e.framebufferRenderbuffer(e.FRAMEBUFFER, n, e.RENDERBUFFER, i);
			}
		}
		n.bindFramebuffer(e.FRAMEBUFFER, null);
	}
	function Te(t, n, r) {
		let i = f.get(t);
		n !== void 0 && xe(i.__webglFramebuffer, t, t.texture, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, 0), r !== void 0 && we(t);
	}
	function Ee(t) {
		let r = t.texture, i = f.get(t), a = f.get(r);
		t.addEventListener("dispose", M);
		let o = t.textures, s = t.isWebGLCubeRenderTarget === !0, c = o.length > 1;
		if (c || (a.__webglTexture === void 0 && (a.__webglTexture = e.createTexture()), a.__version = r.version, h.memory.textures++), s) {
			i.__webglFramebuffer = [];
			for (let t = 0; t < 6; t++) if (r.mipmaps && r.mipmaps.length > 0) {
				i.__webglFramebuffer[t] = [];
				for (let n = 0; n < r.mipmaps.length; n++) i.__webglFramebuffer[t][n] = e.createFramebuffer();
			} else i.__webglFramebuffer[t] = e.createFramebuffer();
		} else {
			if (r.mipmaps && r.mipmaps.length > 0) {
				i.__webglFramebuffer = [];
				for (let t = 0; t < r.mipmaps.length; t++) i.__webglFramebuffer[t] = e.createFramebuffer();
			} else i.__webglFramebuffer = e.createFramebuffer();
			if (c) for (let t = 0, n = o.length; t < n; t++) {
				let n = f.get(o[t]);
				n.__webglTexture === void 0 && (n.__webglTexture = e.createTexture(), h.memory.textures++);
			}
			if (t.samples > 0 && Me(t) === !1) {
				i.__webglMultisampledFramebuffer = e.createFramebuffer(), i.__webglColorRenderbuffer = [], n.bindFramebuffer(e.FRAMEBUFFER, i.__webglMultisampledFramebuffer);
				for (let n = 0; n < o.length; n++) {
					let r = o[n];
					i.__webglColorRenderbuffer[n] = e.createRenderbuffer(), e.bindRenderbuffer(e.RENDERBUFFER, i.__webglColorRenderbuffer[n]);
					let a = m.convert(r.format, r.colorSpace), s = m.convert(r.type), c = A(r.internalFormat, a, s, r.normalized, r.colorSpace, t.isXRRenderTarget === !0), l = je(t);
					e.renderbufferStorageMultisample(e.RENDERBUFFER, l, c, t.width, t.height), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + n, e.RENDERBUFFER, i.__webglColorRenderbuffer[n]);
				}
				e.bindRenderbuffer(e.RENDERBUFFER, null), t.depthBuffer && (i.__webglDepthRenderbuffer = e.createRenderbuffer(), Se(i.__webglDepthRenderbuffer, t, !0)), n.bindFramebuffer(e.FRAMEBUFFER, null);
			}
		}
		if (s) {
			n.bindTexture(e.TEXTURE_CUBE_MAP, a.__webglTexture), he(e.TEXTURE_CUBE_MAP, r);
			for (let n = 0; n < 6; n++) if (r.mipmaps && r.mipmaps.length > 0) for (let a = 0; a < r.mipmaps.length; a++) xe(i.__webglFramebuffer[n][a], t, r, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + n, a);
			else xe(i.__webglFramebuffer[n], t, r, e.COLOR_ATTACHMENT0, e.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0);
			E(r) && D(e.TEXTURE_CUBE_MAP), n.unbindTexture();
		} else if (c) {
			for (let r = 0, a = o.length; r < a; r++) {
				let a = o[r], s = f.get(a), c = e.TEXTURE_2D;
				(t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) && (c = t.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), n.bindTexture(c, s.__webglTexture), he(c, a), xe(i.__webglFramebuffer, t, a, e.COLOR_ATTACHMENT0 + r, c, 0), E(a) && D(c);
			}
			n.unbindTexture();
		} else {
			let o = e.TEXTURE_2D;
			if ((t.isWebGL3DRenderTarget || t.isWebGLArrayRenderTarget) && (o = t.isWebGL3DRenderTarget ? e.TEXTURE_3D : e.TEXTURE_2D_ARRAY), n.bindTexture(o, a.__webglTexture), he(o, r), r.mipmaps && r.mipmaps.length > 0) for (let n = 0; n < r.mipmaps.length; n++) xe(i.__webglFramebuffer[n], t, r, e.COLOR_ATTACHMENT0, o, n);
			else xe(i.__webglFramebuffer, t, r, e.COLOR_ATTACHMENT0, o, 0);
			E(r) && D(o), n.unbindTexture();
		}
		t.depthBuffer && we(t);
	}
	function De(e) {
		let t = e.textures;
		for (let r = 0, i = t.length; r < i; r++) {
			let i = t[r];
			if (E(i)) {
				let t = O(e), r = f.get(i).__webglTexture;
				n.bindTexture(t, r), D(t), n.unbindTexture();
			}
		}
	}
	let Oe = [], ke = [];
	function Ae(t) {
		if (t.samples > 0) {
			if (Me(t) === !1) {
				let r = t.textures, i = t.width, a = t.height, o = e.COLOR_BUFFER_BIT, s = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT, c = f.get(t), l = r.length > 1;
				if (l) for (let t = 0; t < r.length; t++) n.bindFramebuffer(e.FRAMEBUFFER, c.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.RENDERBUFFER, null), n.bindFramebuffer(e.FRAMEBUFFER, c.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.TEXTURE_2D, null, 0);
				n.bindFramebuffer(e.READ_FRAMEBUFFER, c.__webglMultisampledFramebuffer);
				let u = t.texture.mipmaps;
				u && u.length > 0 ? n.bindFramebuffer(e.DRAW_FRAMEBUFFER, c.__webglFramebuffer[0]) : n.bindFramebuffer(e.DRAW_FRAMEBUFFER, c.__webglFramebuffer);
				for (let n = 0; n < r.length; n++) {
					if (t.resolveDepthBuffer && (t.depthBuffer && (o |= e.DEPTH_BUFFER_BIT), t.stencilBuffer && t.resolveStencilBuffer && (o |= e.STENCIL_BUFFER_BIT)), l) {
						e.framebufferRenderbuffer(e.READ_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.RENDERBUFFER, c.__webglColorRenderbuffer[n]);
						let t = f.get(r[n]).__webglTexture;
						e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, t, 0);
					}
					e.blitFramebuffer(0, 0, i, a, 0, 0, i, a, o, e.NEAREST), _ === !0 && (Oe.length = 0, ke.length = 0, Oe.push(e.COLOR_ATTACHMENT0 + n), t.depthBuffer && t.storeMultisampledDepthBuffer === !1 && (Oe.push(s), ke.push(s), e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, ke)), e.invalidateFramebuffer(e.READ_FRAMEBUFFER, Oe));
				}
				if (n.bindFramebuffer(e.READ_FRAMEBUFFER, null), n.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), l) for (let t = 0; t < r.length; t++) {
					n.bindFramebuffer(e.FRAMEBUFFER, c.__webglMultisampledFramebuffer), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.RENDERBUFFER, c.__webglColorRenderbuffer[t]);
					let i = f.get(r[t]).__webglTexture;
					n.bindFramebuffer(e.FRAMEBUFFER, c.__webglFramebuffer), e.framebufferTexture2D(e.DRAW_FRAMEBUFFER, e.COLOR_ATTACHMENT0 + t, e.TEXTURE_2D, i, 0);
				}
				n.bindFramebuffer(e.DRAW_FRAMEBUFFER, c.__webglMultisampledFramebuffer);
			} else if (t.depthBuffer && t.storeMultisampledDepthBuffer === !1 && _) {
				let n = t.stencilBuffer ? e.DEPTH_STENCIL_ATTACHMENT : e.DEPTH_ATTACHMENT;
				e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER, [n]);
			}
		}
	}
	function je(e) {
		return Math.min(p.maxSamples, e.samples);
	}
	function Me(e) {
		let n = f.get(e);
		return e.samples > 0 && t.has("WEBGL_multisampled_render_to_texture") === !0 && n.__useRenderToTexture !== !1;
	}
	function I(e) {
		let t = h.render.frame;
		y.get(e) !== t && (y.set(e, t), e.update());
	}
	function Ne(e, t) {
		let n = e.colorSpace, r = e.format, i = e.type;
		return e.isCompressedTexture === !0 || e.isVideoTexture === !0 || n !== "srgb-linear" && n !== "" && (K.getTransfer(n) === "srgb" ? (r !== 1023 || i !== 1009) && B("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : V("WebGLTextures: Unsupported texture color space:", n)), t;
	}
	function Pe(e) {
		return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement ? (v.width = e.naturalWidth || e.width, v.height = e.naturalHeight || e.height) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (v.width = e.displayWidth, v.height = e.displayHeight) : (v.width = e.width, v.height = e.height), v;
	}
	this.allocateTextureUnit = se, this.resetTextureUnits = ie, this.getTextureUnits = ae, this.setTextureUnits = oe, this.setTexture2D = F, this.setTexture2DArray = le, this.setTexture3D = ue, this.setTextureCube = de, this.rebindTextures = Te, this.setupRenderTarget = Ee, this.updateRenderTargetMipmap = De, this.updateMultisampleRenderTarget = Ae, this.setupDepthRenderbuffer = we, this.setupFrameBufferTexture = xe, this.useMultisampledRTT = Me, this.isReversedDepthBuffer = function() {
		return n.buffers.depth.getReversed();
	};
}
function rd(e, t) {
	function n(n, r = "") {
		let i, a = K.getTransfer(r);
		if (n === 1009) return e.UNSIGNED_BYTE;
		if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
		if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
		if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
		if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
		if (n === 1010) return e.BYTE;
		if (n === 1011) return e.SHORT;
		if (n === 1012) return e.UNSIGNED_SHORT;
		if (n === 1013) return e.INT;
		if (n === 1014) return e.UNSIGNED_INT;
		if (n === 1015) return e.FLOAT;
		if (n === 1016) return e.HALF_FLOAT;
		if (n === 1021) return e.ALPHA;
		if (n === 1022) return e.RGB;
		if (n === 1023) return e.RGBA;
		if (n === 1026) return e.DEPTH_COMPONENT;
		if (n === 1027) return e.DEPTH_STENCIL;
		if (n === 1028) return e.RED;
		if (n === 1029) return e.RED_INTEGER;
		if (n === 1030) return e.RG;
		if (n === 1031) return e.RG_INTEGER;
		if (n === 1033) return e.RGBA_INTEGER;
		if (n === 33776 || n === 33777 || n === 33778 || n === 33779) {
			if (a === "srgb") {
				if (i = t.get("WEBGL_compressed_texture_s3tc_srgb"), i !== null) {
					if (n === 33776) return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;
					if (n === 33777) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
					if (n === 33778) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
					if (n === 33779) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
				} else return null;
			} else if (i = t.get("WEBGL_compressed_texture_s3tc"), i !== null) {
				if (n === 33776) return i.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if (n === 33777) return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if (n === 33778) return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if (n === 33779) return i.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			} else return null;
		}
		if (n === 35840 || n === 35841 || n === 35842 || n === 35843) {
			if (i = t.get("WEBGL_compressed_texture_pvrtc"), i !== null) {
				if (n === 35840) return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if (n === 35841) return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if (n === 35842) return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if (n === 35843) return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
			} else return null;
		}
		if (n === 36196 || n === 37492 || n === 37496 || n === 37488 || n === 37489 || n === 37490 || n === 37491) {
			if (i = t.get("WEBGL_compressed_texture_etc"), i !== null) {
				if (n === 36196 || n === 37492) return a === "srgb" ? i.COMPRESSED_SRGB8_ETC2 : i.COMPRESSED_RGB8_ETC2;
				if (n === 37496) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i.COMPRESSED_RGBA8_ETC2_EAC;
				if (n === 37488) return i.COMPRESSED_R11_EAC;
				if (n === 37489) return i.COMPRESSED_SIGNED_R11_EAC;
				if (n === 37490) return i.COMPRESSED_RG11_EAC;
				if (n === 37491) return i.COMPRESSED_SIGNED_RG11_EAC;
			} else return null;
		}
		if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821) {
			if (i = t.get("WEBGL_compressed_texture_astc"), i !== null) {
				if (n === 37808) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i.COMPRESSED_RGBA_ASTC_4x4_KHR;
				if (n === 37809) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i.COMPRESSED_RGBA_ASTC_5x4_KHR;
				if (n === 37810) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i.COMPRESSED_RGBA_ASTC_5x5_KHR;
				if (n === 37811) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i.COMPRESSED_RGBA_ASTC_6x5_KHR;
				if (n === 37812) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i.COMPRESSED_RGBA_ASTC_6x6_KHR;
				if (n === 37813) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i.COMPRESSED_RGBA_ASTC_8x5_KHR;
				if (n === 37814) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i.COMPRESSED_RGBA_ASTC_8x6_KHR;
				if (n === 37815) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i.COMPRESSED_RGBA_ASTC_8x8_KHR;
				if (n === 37816) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i.COMPRESSED_RGBA_ASTC_10x5_KHR;
				if (n === 37817) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i.COMPRESSED_RGBA_ASTC_10x6_KHR;
				if (n === 37818) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i.COMPRESSED_RGBA_ASTC_10x8_KHR;
				if (n === 37819) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i.COMPRESSED_RGBA_ASTC_10x10_KHR;
				if (n === 37820) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i.COMPRESSED_RGBA_ASTC_12x10_KHR;
				if (n === 37821) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i.COMPRESSED_RGBA_ASTC_12x12_KHR;
			} else return null;
		}
		if (n === 36492 || n === 36494 || n === 36495) {
			if (i = t.get("EXT_texture_compression_bptc"), i !== null) {
				if (n === 36492) return a === "srgb" ? i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i.COMPRESSED_RGBA_BPTC_UNORM_EXT;
				if (n === 36494) return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
				if (n === 36495) return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
			} else return null;
		}
		if (n === 36283 || n === 36284 || n === 36285 || n === 36286) {
			if (i = t.get("EXT_texture_compression_rgtc"), i !== null) {
				if (n === 36283) return i.COMPRESSED_RED_RGTC1_EXT;
				if (n === 36284) return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;
				if (n === 36285) return i.COMPRESSED_RED_GREEN_RGTC2_EXT;
				if (n === 36286) return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
			} else return null;
		}
		return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] === void 0 ? null : e[n];
	}
	return { convert: n };
}
var id = "\nvoid main() {\n\n	gl_Position = vec4( position, 1.0 );\n\n}", ad = "\nuniform sampler2DArray depthColor;\nuniform float depthWidth;\nuniform float depthHeight;\n\nvoid main() {\n\n	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );\n\n	if ( coord.x >= 1.0 ) {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;\n\n	} else {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;\n\n	}\n\n}", od = class {
	constructor() {
		this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
	}
	init(e, t) {
		if (this.texture === null) {
			let n = new Ca(e.texture);
			(e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
		}
	}
	getMesh(e) {
		if (this.texture !== null && this.mesh === null) {
			let t = e.cameras[0].viewport, n = new co({
				vertexShader: id,
				fragmentShader: ad,
				uniforms: {
					depthColor: { value: this.texture },
					depthWidth: { value: t.z },
					depthHeight: { value: t.w }
				}
			});
			this.mesh = new ti(new Qa(20, 20), n);
		}
		return this.mesh;
	}
	reset() {
		this.texture = null, this.mesh = null;
	}
	getDepthTexture() {
		return this.texture;
	}
}, sd = class extends rt {
	constructor(e, t) {
		super();
		let n = this, r = null, i = 1, a = null, o = "local-floor", s = 1, c = null, l = null, u = null, d = null, p = null, m = null, h = typeof XRWebGLBinding < "u", g = new od(), v = {}, y = t.getContextAttributes(), b = null, x = null, C = [], w = [], T = new U(), E = null, A = null, j = new us();
		j.viewport = new qt();
		let ee = new us();
		ee.viewport = new qt();
		let te = [j, ee], M = new ws(), ne = null, N = null;
		this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(e) {
			let t = C[e];
			return t === void 0 && (t = new On(), C[e] = t), t.getTargetRaySpace();
		}, this.getControllerGrip = function(e) {
			let t = C[e];
			return t === void 0 && (t = new On(), C[e] = t), t.getGripSpace();
		}, this.getHand = function(e) {
			let t = C[e];
			return t === void 0 && (t = new On(), C[e] = t), t.getHandSpace();
		};
		function re(e) {
			let t = w.indexOf(e.inputSource);
			if (t === -1) return;
			let n = C[t];
			n !== void 0 && (n.update(e.inputSource, e.frame, c || a), n.dispatchEvent({
				type: e.type,
				data: e.inputSource
			}));
		}
		function P() {
			r.removeEventListener("select", re), r.removeEventListener("selectstart", re), r.removeEventListener("selectend", re), r.removeEventListener("squeeze", re), r.removeEventListener("squeezestart", re), r.removeEventListener("squeezeend", re), r.removeEventListener("end", P), r.removeEventListener("inputsourceschange", ie);
			for (let e = 0; e < C.length; e++) {
				let t = w[e];
				t !== null && (w[e] = null, C[e].disconnect(t));
			}
			ne = null, N = null, g.reset();
			for (let e in v) delete v[e];
			if (e.setRenderTarget(b), p = null, d = null, u = null, r = null, x = null, de.stop(), n.isPresenting = !1, e.setPixelRatio(E), e.setSize(T.width, T.height, !1), A !== null) {
				let e = A.camera;
				e.fov = A.fov, e.zoom = A.zoom, e.updateProjectionMatrix(), A = null;
			}
			n.dispatchEvent({ type: "sessionend" });
		}
		this.setFramebufferScaleFactor = function(e) {
			i = e, n.isPresenting === !0 && B("WebXRManager: Cannot change framebuffer scale while presenting.");
		}, this.setReferenceSpaceType = function(e) {
			o = e, n.isPresenting === !0 && B("WebXRManager: Cannot change reference space type while presenting.");
		}, this.getReferenceSpace = function() {
			return c || a;
		}, this.setReferenceSpace = function(e) {
			c = e;
		}, this.getBaseLayer = function() {
			return d === null ? p : d;
		}, this.getBinding = function() {
			return u === null && h && (u = new XRWebGLBinding(r, t)), u;
		}, this.getFrame = function() {
			return m;
		}, this.getSession = function() {
			return r;
		}, this.setSession = async function(l) {
			if (r = l, r !== null) {
				if (b = e.getRenderTarget(), r.addEventListener("select", re), r.addEventListener("selectstart", re), r.addEventListener("selectend", re), r.addEventListener("squeeze", re), r.addEventListener("squeezestart", re), r.addEventListener("squeezeend", re), r.addEventListener("end", P), r.addEventListener("inputsourceschange", ie), y.xrCompatible !== !0 && await t.makeXRCompatible(), E = e.getPixelRatio(), e.getSize(T), h && "createProjectionLayer" in XRWebGLBinding.prototype) {
					let n = null, a = null, o = null;
					y.depth && (o = y.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, n = y.stencil ? k : O, a = y.stencil ? S : _);
					let s = {
						colorFormat: t.RGBA8,
						depthFormat: o,
						scaleFactor: i
					};
					u = this.getBinding(), d = u.createProjectionLayer(s), r.updateRenderState({ layers: [d] }), e.setPixelRatio(1), e.setSize(d.textureWidth, d.textureHeight, !1), x = new Yt(d.textureWidth, d.textureHeight, {
						format: D,
						type: f,
						depthTexture: new xa(d.textureWidth, d.textureHeight, a, void 0, void 0, void 0, void 0, void 0, void 0, n),
						stencilBuffer: y.stencil,
						colorSpace: e.outputColorSpace,
						samples: y.antialias ? 4 : 0,
						resolveDepthBuffer: d.ignoreDepthValues === !1,
						resolveStencilBuffer: d.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: d.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: d.ignoreDepthValues === !1
					});
				} else {
					let n = {
						antialias: y.antialias,
						alpha: !0,
						depth: y.depth,
						stencil: y.stencil,
						framebufferScaleFactor: i
					};
					p = new XRWebGLLayer(r, t, n), r.updateRenderState({ baseLayer: p }), e.setPixelRatio(1), e.setSize(p.framebufferWidth, p.framebufferHeight, !1), x = new Yt(p.framebufferWidth, p.framebufferHeight, {
						format: D,
						type: f,
						colorSpace: e.outputColorSpace,
						stencilBuffer: y.stencil,
						resolveDepthBuffer: p.ignoreDepthValues === !1,
						resolveStencilBuffer: p.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: p.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: p.ignoreDepthValues === !1
					});
				}
				x.isXRRenderTarget = !0, this.setFoveation(s), c = null, a = await r.requestReferenceSpace(o), de.setContext(r), de.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
			}
		}, this.getEnvironmentBlendMode = function() {
			if (r !== null) return r.environmentBlendMode;
		}, this.getDepthTexture = function() {
			return g.getDepthTexture();
		};
		function ie(e) {
			for (let t = 0; t < e.removed.length; t++) {
				let n = e.removed[t], r = w.indexOf(n);
				r >= 0 && (w[r] = null, C[r].disconnect(n));
			}
			for (let t = 0; t < e.added.length; t++) {
				let n = e.added[t], r = w.indexOf(n);
				if (r === -1) {
					for (let e = 0; e < C.length; e++) if (e >= w.length) {
						w.push(n), r = e;
						break;
					} else if (w[e] === null) {
						w[e] = n, r = e;
						break;
					}
					if (r === -1) break;
				}
				let i = C[r];
				i && i.connect(n);
			}
		}
		let ae = new W(), oe = new W();
		function se(e, t, n) {
			ae.setFromMatrixPosition(t.matrixWorld), oe.setFromMatrixPosition(n.matrixWorld);
			let r = ae.distanceTo(oe), i = t.projectionMatrix.elements, a = n.projectionMatrix.elements, o = i[14] / (i[10] - 1), s = i[14] / (i[10] + 1), c = (i[9] + 1) / i[5], l = (i[9] - 1) / i[5], u = (i[8] - 1) / i[0], d = (a[8] + 1) / a[0], f = o * u, p = o * d, m = r / (-u + d), h = m * -u;
			if (t.matrixWorld.decompose(e.position, e.quaternion, e.scale), e.translateX(h), e.translateZ(m), e.matrixWorld.compose(e.position, e.quaternion, e.scale), e.matrixWorldInverse.copy(e.matrixWorld).invert(), i[10] === -1) e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse);
			else {
				let t = o + m, n = s + m, i = f - h, a = p + (r - h), u = c * s / n * t, d = l * s / n * t;
				e.projectionMatrix.makePerspective(i, a, u, d, t, n), e.projectionMatrixInverse.copy(e.projectionMatrix).invert();
			}
		}
		function ce(e, t) {
			t === null ? e.matrixWorld.copy(e.matrix) : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix), e.matrixWorldInverse.copy(e.matrixWorld).invert();
		}
		this.updateCamera = function(e) {
			if (r === null) return;
			let t = e.near, n = e.far;
			g.texture !== null && (g.depthNear > 0 && (t = g.depthNear), g.depthFar > 0 && (n = g.depthFar)), M.near = ee.near = j.near = t, M.far = ee.far = j.far = n, (ne !== M.near || N !== M.far) && (r.updateRenderState({
				depthNear: M.near,
				depthFar: M.far
			}), ne = M.near, N = M.far), M.layers.mask = e.layers.mask | 6, j.layers.mask = M.layers.mask & -5, ee.layers.mask = M.layers.mask & -3;
			let i = e.parent, a = M.cameras;
			ce(M, i);
			for (let e = 0; e < a.length; e++) ce(a[e], i);
			a.length === 2 ? se(M, j, ee) : M.projectionMatrix.copy(j.projectionMatrix), A === null && e.isPerspectiveCamera && (A = {
				camera: e,
				fov: e.fov,
				zoom: e.zoom
			}), F(e, M, i);
		};
		function F(e, t, n) {
			n === null ? e.matrix.copy(t.matrixWorld) : (e.matrix.copy(n.matrixWorld), e.matrix.invert(), e.matrix.multiply(t.matrixWorld)), e.matrix.decompose(e.position, e.quaternion, e.scale), e.updateMatrixWorld(!0), e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse), e.isPerspectiveCamera && (e.fov = st * 2 * Math.atan(1 / e.projectionMatrix.elements[5]), e.zoom = 1);
		}
		this.getCamera = function() {
			return M;
		}, this.getFoveation = function() {
			if (d !== null || p !== null) return s;
		}, this.setFoveation = function(e) {
			s = e, d !== null && (d.fixedFoveation = e), p !== null && p.fixedFoveation !== void 0 && (p.fixedFoveation = e);
		}, this.hasDepthSensing = function() {
			return g.texture !== null;
		}, this.getDepthSensingMesh = function() {
			return g.getMesh(M);
		}, this.getCameraTexture = function(e) {
			return v[e];
		};
		let le = null;
		function ue(t, i) {
			if (l = i.getViewerPose(c || a), m = i, l !== null) {
				let t = l.views;
				p !== null && (e.setRenderTargetFramebuffer(x, p.framebuffer), e.setRenderTarget(x));
				let i = !1;
				t.length !== M.cameras.length && (M.cameras.length = 0, i = !0);
				for (let n = 0; n < t.length; n++) {
					let r = t[n], a = null;
					if (p !== null) a = p.getViewport(r);
					else {
						let t = u.getViewSubImage(d, r);
						a = t.viewport, n === 0 && (e.setRenderTargetTextures(x, t.colorTexture, t.depthStencilTexture), e.setRenderTarget(x));
					}
					let o = te[n];
					o === void 0 && (o = new us(), o.layers.enable(n), o.viewport = new qt(), te[n] = o), o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.quaternion, o.scale), o.projectionMatrix.fromArray(r.projectionMatrix), o.projectionMatrixInverse.copy(o.projectionMatrix).invert(), o.viewport.set(a.x, a.y, a.width, a.height), n === 0 && (M.matrix.copy(o.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), i === !0 && M.cameras.push(o);
				}
				let a = r.enabledFeatures;
				if (a && a.includes("depth-sensing") && r.depthUsage == "gpu-optimized" && h) {
					u = n.getBinding();
					let e = u.getDepthInformation(t[0]);
					e && e.isValid && e.texture && g.init(e, r.renderState);
				}
				if (a && a.includes("camera-access") && h) {
					e.state.unbindTexture(), u = n.getBinding();
					for (let e = 0; e < t.length; e++) {
						let n = t[e].camera;
						if (n) {
							let e = v[n];
							e || (e = new Ca(), v[n] = e);
							let t = u.getCameraImage(n);
							e.sourceTexture = t;
						}
					}
				}
			}
			for (let e = 0; e < C.length; e++) {
				let t = w[e], n = C[e];
				t !== null && n !== void 0 && n.update(t, i, c || a);
			}
			le && le(t, i), i.detectedPlanes && n.dispatchEvent({
				type: "planesdetected",
				data: i
			}), m = null;
		}
		let de = new $s();
		de.setAnimationLoop(ue), this.setAnimationLoop = function(e) {
			le = e;
		}, this.dispose = function() {};
	}
}, cd = /*@__PURE__*/ new q(), ld = /*@__PURE__*/ new G();
ld.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function ud(e, t) {
	function n(e, t) {
		e.matrixAutoUpdate === !0 && e.updateMatrix(), t.value.copy(e.matrix);
	}
	function r(t, n) {
		n.color.getRGB(t.fogColor.value, io(e)), n.isFog ? (t.fogNear.value = n.near, t.fogFar.value = n.far) : n.isFogExp2 && (t.fogDensity.value = n.density);
	}
	function i(e, t, n, r, i) {
		t.isNodeMaterial ? t.uniformsNeedUpdate = !1 : t.isMeshBasicMaterial ? a(e, t) : t.isMeshLambertMaterial ? (a(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshToonMaterial ? (a(e, t), d(e, t)) : t.isMeshPhongMaterial ? (a(e, t), u(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshStandardMaterial ? (a(e, t), f(e, t), t.isMeshPhysicalMaterial && p(e, t, i)) : t.isMeshMatcapMaterial ? (a(e, t), m(e, t)) : t.isMeshDepthMaterial ? a(e, t) : t.isMeshDistanceMaterial ? (a(e, t), h(e, t)) : t.isMeshNormalMaterial ? a(e, t) : t.isLineBasicMaterial ? (o(e, t), t.isLineDashedMaterial && s(e, t)) : t.isPointsMaterial ? c(e, t, n, r) : t.isSpriteMaterial ? l(e, t) : t.isShadowMaterial ? (e.color.value.copy(t.color), e.opacity.value = t.opacity) : t.isShaderMaterial && (t.uniformsNeedUpdate = !1);
	}
	function a(e, r) {
		e.opacity.value = r.opacity, r.color && e.diffuse.value.copy(r.color), r.emissive && e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity), r.map && (e.map.value = r.map, n(r.map, e.mapTransform)), r.alphaMap && (e.alphaMap.value = r.alphaMap, n(r.alphaMap, e.alphaMapTransform)), r.bumpMap && (e.bumpMap.value = r.bumpMap, n(r.bumpMap, e.bumpMapTransform), e.bumpScale.value = r.bumpScale, r.side === 1 && (e.bumpScale.value *= -1)), r.normalMap && (e.normalMap.value = r.normalMap, n(r.normalMap, e.normalMapTransform), e.normalScale.value.copy(r.normalScale), r.side === 1 && e.normalScale.value.negate()), r.displacementMap && (e.displacementMap.value = r.displacementMap, n(r.displacementMap, e.displacementMapTransform), e.displacementScale.value = r.displacementScale, e.displacementBias.value = r.displacementBias), r.emissiveMap && (e.emissiveMap.value = r.emissiveMap, n(r.emissiveMap, e.emissiveMapTransform)), r.specularMap && (e.specularMap.value = r.specularMap, n(r.specularMap, e.specularMapTransform)), r.alphaTest > 0 && (e.alphaTest.value = r.alphaTest);
		let i = t.get(r), a = i.envMap, o = i.envMapRotation;
		a && (e.envMap.value = a, e.envMapRotation.value.setFromMatrix4(cd.makeRotationFromEuler(o)).transpose(), a.isCubeTexture && a.isRenderTargetTexture === !1 && e.envMapRotation.value.premultiply(ld), e.reflectivity.value = r.reflectivity, e.ior.value = r.ior, e.refractionRatio.value = r.refractionRatio), r.lightMap && (e.lightMap.value = r.lightMap, e.lightMapIntensity.value = r.lightMapIntensity, n(r.lightMap, e.lightMapTransform)), r.aoMap && (e.aoMap.value = r.aoMap, e.aoMapIntensity.value = r.aoMapIntensity, n(r.aoMap, e.aoMapTransform));
	}
	function o(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, t.map && (e.map.value = t.map, n(t.map, e.mapTransform));
	}
	function s(e, t) {
		e.dashSize.value = t.dashSize, e.totalSize.value = t.dashSize + t.gapSize, e.scale.value = t.scale;
	}
	function c(e, t, r, i) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.size.value = t.size * r, e.scale.value = i * .5, t.map && (e.map.value = t.map, n(t.map, e.uvTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function l(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.rotation.value = t.rotation, t.map && (e.map.value = t.map, n(t.map, e.mapTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function u(e, t) {
		e.specular.value.copy(t.specular), e.shininess.value = Math.max(t.shininess, 1e-4);
	}
	function d(e, t) {
		t.gradientMap && (e.gradientMap.value = t.gradientMap);
	}
	function f(e, t) {
		e.metalness.value = t.metalness, t.metalnessMap && (e.metalnessMap.value = t.metalnessMap, n(t.metalnessMap, e.metalnessMapTransform)), e.roughness.value = t.roughness, t.roughnessMap && (e.roughnessMap.value = t.roughnessMap, n(t.roughnessMap, e.roughnessMapTransform)), t.envMap && (e.envMapIntensity.value = t.envMapIntensity);
	}
	function p(e, t, r) {
		e.ior.value = t.ior, t.sheen > 0 && (e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen), e.sheenRoughness.value = t.sheenRoughness, t.sheenColorMap && (e.sheenColorMap.value = t.sheenColorMap, n(t.sheenColorMap, e.sheenColorMapTransform)), t.sheenRoughnessMap && (e.sheenRoughnessMap.value = t.sheenRoughnessMap, n(t.sheenRoughnessMap, e.sheenRoughnessMapTransform))), t.clearcoat > 0 && (e.clearcoat.value = t.clearcoat, e.clearcoatRoughness.value = t.clearcoatRoughness, t.clearcoatMap && (e.clearcoatMap.value = t.clearcoatMap, n(t.clearcoatMap, e.clearcoatMapTransform)), t.clearcoatRoughnessMap && (e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap, n(t.clearcoatRoughnessMap, e.clearcoatRoughnessMapTransform)), t.clearcoatNormalMap && (e.clearcoatNormalMap.value = t.clearcoatNormalMap, n(t.clearcoatNormalMap, e.clearcoatNormalMapTransform), e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale), t.side === 1 && e.clearcoatNormalScale.value.negate())), t.dispersion > 0 && (e.dispersion.value = t.dispersion), t.retroreflectivity > 0 && (e.retroreflectivity.value = t.retroreflectivity), t.iridescence > 0 && (e.iridescence.value = t.iridescence, e.iridescenceIOR.value = t.iridescenceIOR, e.iridescenceThicknessMinimum.value = t.iridescenceThicknessRange[0], e.iridescenceThicknessMaximum.value = t.iridescenceThicknessRange[1], t.iridescenceMap && (e.iridescenceMap.value = t.iridescenceMap, n(t.iridescenceMap, e.iridescenceMapTransform)), t.iridescenceThicknessMap && (e.iridescenceThicknessMap.value = t.iridescenceThicknessMap, n(t.iridescenceThicknessMap, e.iridescenceThicknessMapTransform))), t.transmission > 0 && (e.transmission.value = t.transmission, e.transmissionSamplerMap.value = r.texture, e.transmissionSamplerSize.value.set(r.width, r.height), t.transmissionMap && (e.transmissionMap.value = t.transmissionMap, n(t.transmissionMap, e.transmissionMapTransform)), e.thickness.value = t.thickness, t.thicknessMap && (e.thicknessMap.value = t.thicknessMap, n(t.thicknessMap, e.thicknessMapTransform)), e.attenuationDistance.value = t.attenuationDistance, e.attenuationColor.value.copy(t.attenuationColor)), t.anisotropy > 0 && (e.anisotropyVector.value.set(t.anisotropy * Math.cos(t.anisotropyRotation), t.anisotropy * Math.sin(t.anisotropyRotation)), t.anisotropyMap && (e.anisotropyMap.value = t.anisotropyMap, n(t.anisotropyMap, e.anisotropyMapTransform))), e.specularIntensity.value = t.specularIntensity, e.specularColor.value.copy(t.specularColor), t.specularColorMap && (e.specularColorMap.value = t.specularColorMap, n(t.specularColorMap, e.specularColorMapTransform)), t.specularIntensityMap && (e.specularIntensityMap.value = t.specularIntensityMap, n(t.specularIntensityMap, e.specularIntensityMapTransform));
	}
	function m(e, t) {
		t.matcap && (e.matcap.value = t.matcap);
	}
	function h(e, n) {
		let r = t.get(n).light;
		e.referencePosition.value.setFromMatrixPosition(r.matrixWorld), e.nearDistance.value = r.shadow.camera.near, e.farDistance.value = r.shadow.camera.far;
	}
	return {
		refreshFogUniforms: r,
		refreshMaterialUniforms: i
	};
}
function dd(e, t, n, r) {
	let i = {}, a = {}, o = [], s = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
	function c(e, t) {
		let n = t.program;
		r.uniformBlockBinding(e, n);
	}
	function l(e, n) {
		let o = i[e.id];
		o === void 0 && (g(e), o = u(e), i[e.id] = o, e.addEventListener("dispose", v));
		let s = n.program;
		r.updateUBOMapping(e, s);
		let c = t.render.frame;
		a[e.id] !== c && (f(e), a[e.id] = c);
	}
	function u(t) {
		let n = d();
		t.__bindingPointIndex = n;
		let r = e.createBuffer(), i = t.__size, a = t.usage;
		return e.bindBuffer(e.UNIFORM_BUFFER, r), e.bufferData(e.UNIFORM_BUFFER, i, a), e.bindBuffer(e.UNIFORM_BUFFER, null), e.bindBufferBase(e.UNIFORM_BUFFER, n, r), r;
	}
	function d() {
		for (let e = 0; e < s; e++) if (o.indexOf(e) === -1) return o.push(e), e;
		return V("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
	}
	function f(t) {
		let n = i[t.id], r = t.uniforms, a = t.__cache;
		e.bindBuffer(e.UNIFORM_BUFFER, n);
		for (let e = 0, t = r.length; e < t; e++) {
			let t = r[e];
			if (Array.isArray(t)) for (let n = 0, r = t.length; n < r; n++) p(t[n], e, n, a);
			else p(t, e, 0, a);
		}
		e.bindBuffer(e.UNIFORM_BUFFER, null);
	}
	function p(t, n, r, i) {
		if (h(t, n, r, i) === !0) {
			let n = t.__offset, r = t.value;
			if (Array.isArray(r)) {
				let e = 0;
				for (let n = 0; n < r.length; n++) {
					let i = r[n], a = _(i);
					m(i, t.__data, e), typeof i != "number" && typeof i != "boolean" && !i.isMatrix3 && !ArrayBuffer.isView(i) && (e += a.storage / Float32Array.BYTES_PER_ELEMENT);
				}
			} else m(r, t.__data, 0);
			e.bufferSubData(e.UNIFORM_BUFFER, n, t.__data);
		}
	}
	function m(e, t, n) {
		typeof e == "number" || typeof e == "boolean" ? t[0] = e : e.isMatrix3 ? (t[0] = e.elements[0], t[1] = e.elements[1], t[2] = e.elements[2], t[3] = 0, t[4] = e.elements[3], t[5] = e.elements[4], t[6] = e.elements[5], t[7] = 0, t[8] = e.elements[6], t[9] = e.elements[7], t[10] = e.elements[8], t[11] = 0) : ArrayBuffer.isView(e) ? t.set(new e.constructor(e.buffer, e.byteOffset, t.length)) : e.toArray(t, n);
	}
	function h(e, t, n, r) {
		let i = e.value, a = t + "_" + n;
		if (r[a] === void 0) return r[a] = typeof i == "number" || typeof i == "boolean" ? i : ArrayBuffer.isView(i) ? i.slice() : i.clone(), !0;
		{
			let e = r[a];
			if (typeof i == "number" || typeof i == "boolean") {
				if (e !== i) return r[a] = i, !0;
			} else if (ArrayBuffer.isView(i)) return !0;
			else if (e.equals(i) === !1) return e.copy(i), !0;
		}
		return !1;
	}
	function g(e) {
		let t = e.uniforms, n = 0;
		for (let e = 0, r = t.length; e < r; e++) {
			let r = Array.isArray(t[e]) ? t[e] : [t[e]];
			for (let e = 0, t = r.length; e < t; e++) {
				let t = r[e], i = Array.isArray(t.value) ? t.value : [t.value];
				for (let e = 0, r = i.length; e < r; e++) {
					let r = i[e], a = _(r), o = n % 16, s = o % a.boundary, c = o + s;
					n += s, c !== 0 && 16 - c < a.storage && (n += 16 - c), t.__data = new Float32Array(a.storage / Float32Array.BYTES_PER_ELEMENT), t.__offset = n, n += a.storage;
				}
			}
		}
		let r = n % 16;
		return r > 0 && (n += 16 - r), e.__size = n, e.__cache = {}, this;
	}
	function _(e) {
		let t = {
			boundary: 0,
			storage: 0
		};
		return typeof e == "number" || typeof e == "boolean" ? (t.boundary = 4, t.storage = 4) : e.isVector2 ? (t.boundary = 8, t.storage = 8) : e.isVector3 || e.isColor ? (t.boundary = 16, t.storage = 12) : e.isVector4 ? (t.boundary = 16, t.storage = 16) : e.isMatrix3 ? (t.boundary = 48, t.storage = 48) : e.isMatrix4 ? (t.boundary = 64, t.storage = 64) : e.isTexture ? B("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(e) ? (t.boundary = 16, t.storage = e.byteLength) : B("WebGLRenderer: Unsupported uniform value type.", e), t;
	}
	function v(t) {
		let n = t.target;
		n.removeEventListener("dispose", v);
		let r = o.indexOf(n.__bindingPointIndex);
		o.splice(r, 1), e.deleteBuffer(i[n.id]), delete i[n.id], delete a[n.id];
	}
	function y() {
		for (let t in i) e.deleteBuffer(i[t]);
		o = [], i = {}, a = {};
	}
	return {
		bind: c,
		update: l,
		dispose: y
	};
}
var fd = new Uint16Array([
	12469,
	15057,
	12620,
	14925,
	13266,
	14620,
	13807,
	14376,
	14323,
	13990,
	14545,
	13625,
	14713,
	13328,
	14840,
	12882,
	14931,
	12528,
	14996,
	12233,
	15039,
	11829,
	15066,
	11525,
	15080,
	11295,
	15085,
	10976,
	15082,
	10705,
	15073,
	10495,
	13880,
	14564,
	13898,
	14542,
	13977,
	14430,
	14158,
	14124,
	14393,
	13732,
	14556,
	13410,
	14702,
	12996,
	14814,
	12596,
	14891,
	12291,
	14937,
	11834,
	14957,
	11489,
	14958,
	11194,
	14943,
	10803,
	14921,
	10506,
	14893,
	10278,
	14858,
	9960,
	14484,
	14039,
	14487,
	14025,
	14499,
	13941,
	14524,
	13740,
	14574,
	13468,
	14654,
	13106,
	14743,
	12678,
	14818,
	12344,
	14867,
	11893,
	14889,
	11509,
	14893,
	11180,
	14881,
	10751,
	14852,
	10428,
	14812,
	10128,
	14765,
	9754,
	14712,
	9466,
	14764,
	13480,
	14764,
	13475,
	14766,
	13440,
	14766,
	13347,
	14769,
	13070,
	14786,
	12713,
	14816,
	12387,
	14844,
	11957,
	14860,
	11549,
	14868,
	11215,
	14855,
	10751,
	14825,
	10403,
	14782,
	10044,
	14729,
	9651,
	14666,
	9352,
	14599,
	9029,
	14967,
	12835,
	14966,
	12831,
	14963,
	12804,
	14954,
	12723,
	14936,
	12564,
	14917,
	12347,
	14900,
	11958,
	14886,
	11569,
	14878,
	11247,
	14859,
	10765,
	14828,
	10401,
	14784,
	10011,
	14727,
	9600,
	14660,
	9289,
	14586,
	8893,
	14508,
	8533,
	15111,
	12234,
	15110,
	12234,
	15104,
	12216,
	15092,
	12156,
	15067,
	12010,
	15028,
	11776,
	14981,
	11500,
	14942,
	11205,
	14902,
	10752,
	14861,
	10393,
	14812,
	9991,
	14752,
	9570,
	14682,
	9252,
	14603,
	8808,
	14519,
	8445,
	14431,
	8145,
	15209,
	11449,
	15208,
	11451,
	15202,
	11451,
	15190,
	11438,
	15163,
	11384,
	15117,
	11274,
	15055,
	10979,
	14994,
	10648,
	14932,
	10343,
	14871,
	9936,
	14803,
	9532,
	14729,
	9218,
	14645,
	8742,
	14556,
	8381,
	14461,
	8020,
	14365,
	7603,
	15273,
	10603,
	15272,
	10607,
	15267,
	10619,
	15256,
	10631,
	15231,
	10614,
	15182,
	10535,
	15118,
	10389,
	15042,
	10167,
	14963,
	9787,
	14883,
	9447,
	14800,
	9115,
	14710,
	8665,
	14615,
	8318,
	14514,
	7911,
	14411,
	7507,
	14279,
	7198,
	15314,
	9675,
	15313,
	9683,
	15309,
	9712,
	15298,
	9759,
	15277,
	9797,
	15229,
	9773,
	15166,
	9668,
	15084,
	9487,
	14995,
	9274,
	14898,
	8910,
	14800,
	8539,
	14697,
	8234,
	14590,
	7790,
	14479,
	7409,
	14367,
	7067,
	14178,
	6621,
	15337,
	8619,
	15337,
	8631,
	15333,
	8677,
	15325,
	8769,
	15305,
	8871,
	15264,
	8940,
	15202,
	8909,
	15119,
	8775,
	15022,
	8565,
	14916,
	8328,
	14804,
	8009,
	14688,
	7614,
	14569,
	7287,
	14448,
	6888,
	14321,
	6483,
	14088,
	6171,
	15350,
	7402,
	15350,
	7419,
	15347,
	7480,
	15340,
	7613,
	15322,
	7804,
	15287,
	7973,
	15229,
	8057,
	15148,
	8012,
	15046,
	7846,
	14933,
	7611,
	14810,
	7357,
	14682,
	7069,
	14552,
	6656,
	14421,
	6316,
	14251,
	5948,
	14007,
	5528,
	15356,
	5942,
	15356,
	5977,
	15353,
	6119,
	15348,
	6294,
	15332,
	6551,
	15302,
	6824,
	15249,
	7044,
	15171,
	7122,
	15070,
	7050,
	14949,
	6861,
	14818,
	6611,
	14679,
	6349,
	14538,
	6067,
	14398,
	5651,
	14189,
	5311,
	13935,
	4958,
	15359,
	4123,
	15359,
	4153,
	15356,
	4296,
	15353,
	4646,
	15338,
	5160,
	15311,
	5508,
	15263,
	5829,
	15188,
	6042,
	15088,
	6094,
	14966,
	6001,
	14826,
	5796,
	14678,
	5543,
	14527,
	5287,
	14377,
	4985,
	14133,
	4586,
	13869,
	4257,
	15360,
	1563,
	15360,
	1642,
	15358,
	2076,
	15354,
	2636,
	15341,
	3350,
	15317,
	4019,
	15273,
	4429,
	15203,
	4732,
	15105,
	4911,
	14981,
	4932,
	14836,
	4818,
	14679,
	4621,
	14517,
	4386,
	14359,
	4156,
	14083,
	3795,
	13808,
	3437,
	15360,
	122,
	15360,
	137,
	15358,
	285,
	15355,
	636,
	15344,
	1274,
	15322,
	2177,
	15281,
	2765,
	15215,
	3223,
	15120,
	3451,
	14995,
	3569,
	14846,
	3567,
	14681,
	3466,
	14511,
	3305,
	14344,
	3121,
	14037,
	2800,
	13753,
	2467,
	15360,
	0,
	15360,
	1,
	15359,
	21,
	15355,
	89,
	15346,
	253,
	15325,
	479,
	15287,
	796,
	15225,
	1148,
	15133,
	1492,
	15008,
	1749,
	14856,
	1882,
	14685,
	1886,
	14506,
	1783,
	14324,
	1608,
	13996,
	1398,
	13702,
	1183
]), pd = null;
function md() {
	return pd === null && (pd = new hi(fd, 16, 16, ee, y), pd.name = "DFG_LUT", pd.minFilter = l, pd.magFilter = l, pd.wrapS = i, pd.wrapT = i, pd.generateMipmaps = !1, pd.needsUpdate = !0), pd;
}
var hd = class {
	constructor(e = {}) {
		let { canvas: t = Xe(), context: n = null, depth: r = !0, stencil: i = !1, alpha: a = !1, antialias: o = !1, premultipliedAlpha: s = !0, preserveDrawingBuffer: c = !1, powerPreference: l = "default", failIfMajorPerformanceCaveat: u = !1, reversedDepthBuffer: p = !1, outputBufferType: m = f } = e;
		this.isWebGLRenderer = !0;
		let g;
		if (n !== null) {
			if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
			g = n.getContextAttributes().alpha;
		} else g = a;
		let v = m, C = /* @__PURE__ */ new Set([
			M,
			te,
			j
		]), w = /* @__PURE__ */ new Set([
			f,
			_,
			h,
			S,
			b,
			x
		]), T = /* @__PURE__ */ new Uint32Array(4), E = /* @__PURE__ */ new Int32Array(4), D = new W(), O = null, k = null, A = [], ee = [], ne = null;
		this.domElement = t, this.debug = {
			checkShaderErrors: !0,
			diagnostics: { keywords: !1 },
			onShaderError: null
		}, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
		let N = this, re = !1, P = null, ie = null, ae = null, oe = null;
		this._outputColorSpace = Be;
		let se = 0, ce = 0, F = null, le = -1, ue = null, de = new qt(), fe = new qt(), pe = null, me = new J(0), he = 0, ge = t.width, _e = t.height, ve = 1, ye = null, be = null, xe = new qt(0, 0, ge, _e), Se = new qt(0, 0, ge, _e), Ce = !1, we = new ji(), Te = !1, Ee = !1, De = new q(), Oe = new W(), ke = new qt(), Ae = {
			background: null,
			fog: null,
			environment: null,
			overrideMaterial: null,
			isScene: !0
		}, je = !1;
		function Me() {
			return F === null ? ve : 1;
		}
		let I = n;
		function Ne(e, n) {
			return t.getContext(e, n);
		}
		let Pe, Fe, L, Ie, R, z, Le, Re, ze, Ve, He, Ue, We, Ge, qe, Je, Ye, Ze, $e, et, nt, rt, it;
		try {
			let e = {
				alpha: !0,
				depth: r,
				stencil: i,
				antialias: o,
				premultipliedAlpha: s,
				preserveDrawingBuffer: c,
				powerPreference: l,
				failIfMajorPerformanceCaveat: u
			};
			if ("setAttribute" in t && t.setAttribute("data-engine", "three.js r186"), t.addEventListener("webglcontextlost", st, !1), t.addEventListener("webglcontextrestored", ct, !1), t.addEventListener("webglcontextcreationerror", H, !1), I === null) {
				let t = "webgl2";
				if (I = Ne(t, e), I === null) throw Ne(t) ? Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.") : Error("THREE.WebGLRenderer: Error creating WebGL context.");
			}
			at();
		} catch (e) {
			throw t.removeEventListener("webglcontextlost", st, !1), t.removeEventListener("webglcontextrestored", ct, !1), t.removeEventListener("webglcontextcreationerror", H, !1), V("WebGLRenderer: " + e.message), e;
		}
		function at() {
			Pe = new Nc(I), Pe.init(), nt = new rd(I, Pe), Fe = new cc(I, Pe, e, nt), L = new td(I, Pe), Fe.reversedDepthBuffer && p && L.buffers.depth.setReversed(!0), ie = I.createFramebuffer(), ae = I.createFramebuffer(), oe = I.createFramebuffer(), Ie = new Ic(I), R = new Fu(), z = new nd(I, Pe, L, R, Fe, nt, Ie), Le = new Mc(N), Re = new ec(I), rt = new oc(I, Re), ze = new Pc(I, Re, Ie, rt), Ve = new Rc(I, ze, Re, rt, Ie), Ze = new Lc(I, Fe, z), qe = new lc(R), He = new Pu(N, Le, Pe, Fe, rt, qe), Ue = new ud(N, R), We = new zu(), Ge = new Ku(Pe), Ye = new ac(N, Le, L, Ve, g, s), Je = new ed(N, Ve, Fe), it = new dd(I, Ie, Fe, L), $e = new sc(I, Pe, Ie), et = new Fc(I, Pe, Ie), Ie.programs = He.programs, N.capabilities = Fe, N.extensions = Pe, N.properties = R, N.renderLists = We, N.shadowMap = Je, N.state = L, N.info = Ie;
		}
		v !== 1009 && (ne = new Bc(v, t.width, t.height, o, r, i));
		let ot = new sd(N, I);
		this.xr = ot, this.getContext = function() {
			return I;
		}, this.getContextAttributes = function() {
			return I.getContextAttributes();
		}, this.forceContextLoss = function() {
			let e = Pe.get("WEBGL_lose_context");
			e && e.loseContext();
		}, this.forceContextRestore = function() {
			let e = Pe.get("WEBGL_lose_context");
			e && e.restoreContext();
		}, this.getPixelRatio = function() {
			return ve;
		}, this.setPixelRatio = function(e) {
			e !== void 0 && (ve = e, this.setSize(ge, _e, !1));
		}, this.getSize = function(e) {
			return e.set(ge, _e);
		}, this.setSize = function(e, n, r = !0) {
			ot.isPresenting ? B("WebGLRenderer: Can't change size while VR device is presenting.") : (ge = e, _e = n, t.width = Math.floor(e * ve), t.height = Math.floor(n * ve), r === !0 && (t.style.width = e + "px", t.style.height = n + "px"), ne !== null && ne.setSize(t.width, t.height), this.setViewport(0, 0, e, n));
		}, this.getDrawingBufferSize = function(e) {
			return e.set(ge * ve, _e * ve).floor();
		}, this.setDrawingBufferSize = function(e, n, r) {
			ge = e, _e = n, ve = r, t.width = Math.floor(e * r), t.height = Math.floor(n * r), this.setViewport(0, 0, e, n);
		}, this.setEffects = function(e) {
			if (v === 1009) V("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
			else {
				if (e) {
					for (let t = 0; t < e.length; t++) if (e[t].isOutputPass === !0) {
						B("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
						break;
					}
				}
				ne.setEffects(e || []);
			}
		}, this.getCurrentViewport = function(e) {
			return e.copy(de);
		}, this.getViewport = function(e) {
			return e.copy(xe);
		}, this.setViewport = function(e, t, n, r) {
			e.isVector4 ? xe.set(e.x, e.y, e.z, e.w) : xe.set(e, t, n, r), L.viewport(de.copy(xe).multiplyScalar(ve).round());
		}, this.getScissor = function(e) {
			return e.copy(Se);
		}, this.setScissor = function(e, t, n, r) {
			e.isVector4 ? Se.set(e.x, e.y, e.z, e.w) : Se.set(e, t, n, r), L.scissor(fe.copy(Se).multiplyScalar(ve).round());
		}, this.getScissorTest = function() {
			return Ce;
		}, this.setScissorTest = function(e) {
			L.setScissorTest(Ce = e);
		}, this.setOpaqueSort = function(e) {
			ye = e;
		}, this.setTransparentSort = function(e) {
			be = e;
		}, this.getClearColor = function(e) {
			return e.copy(Ye.getClearColor());
		}, this.setClearColor = function() {
			Ye.setClearColor(...arguments);
		}, this.getClearAlpha = function() {
			return Ye.getClearAlpha();
		}, this.setClearAlpha = function() {
			Ye.setClearAlpha(...arguments);
		}, this.clear = function(e = !0, t = !0, n = !0) {
			let r = 0;
			if (e) {
				let e = !1;
				if (F !== null) {
					let t = F.texture.format;
					e = C.has(t);
				}
				if (e) {
					let e = F.texture.type, t = w.has(e), n = Ye.getClearColor(), r = Ye.getClearAlpha(), i = n.r, a = n.g, o = n.b;
					t ? (T[0] = i, T[1] = a, T[2] = o, T[3] = r, I.clearBufferuiv(I.COLOR, 0, T)) : (E[0] = i, E[1] = a, E[2] = o, E[3] = r, I.clearBufferiv(I.COLOR, 0, E));
				} else r |= I.COLOR_BUFFER_BIT;
			}
			t && (r |= I.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), n && (r |= I.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), r !== 0 && I.clear(r);
		}, this.clearColor = function() {
			this.clear(!0, !1, !1);
		}, this.clearDepth = function() {
			this.clear(!1, !0, !1);
		}, this.clearStencil = function() {
			this.clear(!1, !1, !0);
		}, this.setNodesHandler = function(e) {
			e.setRenderer(this), P = e;
		}, this.dispose = function() {
			t.removeEventListener("webglcontextlost", st, !1), t.removeEventListener("webglcontextrestored", ct, !1), t.removeEventListener("webglcontextcreationerror", H, !1), Ye.dispose(), We.dispose(), Ge.dispose(), R.dispose(), Le.dispose(), Ve.dispose(), rt.dispose(), it.dispose(), He.dispose(), ot.dispose(), ot.removeEventListener("sessionstart", ht), ot.removeEventListener("sessionend", gt), _t.stop();
		};
		function st(e) {
			e.preventDefault(), Qe("WebGLRenderer: Context Lost."), re = !0;
		}
		function ct() {
			Qe("WebGLRenderer: Context Restored."), re = !1;
			let e = Ie.autoReset, t = Je.enabled, n = Je.autoUpdate, r = Je.needsUpdate, i = Je.type;
			at(), Ie.autoReset = e, Je.enabled = t, Je.autoUpdate = n, Je.needsUpdate = r, Je.type = i;
		}
		function H(e) {
			V("WebGLRenderer: A WebGL context could not be created. Reason: ", e.statusMessage);
		}
		function lt(e) {
			let t = e.target;
			t.removeEventListener("dispose", lt), ut(t);
		}
		function ut(e) {
			dt(e), R.remove(e);
		}
		function dt(e) {
			let t = R.get(e).programs;
			t !== void 0 && (t.forEach(function(e) {
				He.releaseProgram(e);
			}), e.isShaderMaterial && He.releaseShaderCache(e));
		}
		this.renderBufferDirect = function(e, t, n, r, i, a) {
			t === null && (t = Ae);
			let o = i.isMesh && i.matrixWorld.determinantAffine() < 0, s = Dt(e, t, n, r, i);
			L.setMaterial(r, o);
			let c = n.index, l = 1;
			if (r.wireframe === !0) {
				if (c = ze.getWireframeAttribute(n), c === void 0) return;
				l = 2;
			}
			let u = n.drawRange, d = n.attributes.position, f = u.start * l, p = (u.start + u.count) * l;
			a !== null && (f = Math.max(f, a.start * l), p = Math.min(p, (a.start + a.count) * l)), c === null ? d != null && (f = Math.max(f, 0), p = Math.min(p, d.count)) : (f = Math.max(f, 0), p = Math.min(p, c.count));
			let m = p - f;
			if (m < 0 || m === Infinity) return;
			rt.setup(i, r, s, n, c);
			let h, g = $e;
			if (c !== null && (h = Re.get(c), g = et, g.setIndex(h)), i.isMesh) r.wireframe === !0 ? (L.setLineWidth(r.wireframeLinewidth * Me()), g.setMode(I.LINES)) : g.setMode(I.TRIANGLES);
			else if (i.isLine) {
				let e = r.linewidth;
				e === void 0 && (e = 1), L.setLineWidth(e * Me()), i.isLineSegments ? g.setMode(I.LINES) : i.isLineLoop ? g.setMode(I.LINE_LOOP) : g.setMode(I.LINE_STRIP);
			} else i.isPoints ? g.setMode(I.POINTS) : i.isSprite && g.setMode(I.TRIANGLES);
			if (i.isBatchedMesh) {
				if (Pe.get("WEBGL_multi_draw")) g.renderMultiDraw(i._multiDrawStarts, i._multiDrawCounts, i._multiDrawCount);
				else {
					let e = i._multiDrawStarts, t = i._multiDrawCounts, n = i._multiDrawCount, a = c ? Re.get(c).bytesPerElement : 1, o = R.get(r).currentProgram.getUniforms();
					for (let r = 0; r < n; r++) o.setValue(I, "_gl_DrawID", r), g.render(e[r] / a, t[r]);
				}
			} else if (i.isInstancedMesh) g.renderInstances(f, m, i.count);
			else if (n.isInstancedBufferGeometry) {
				let e = n._maxInstanceCount === void 0 ? Infinity : n._maxInstanceCount, t = Math.min(n.instanceCount, e);
				g.renderInstances(f, m, t);
			} else g.render(f, m);
		};
		function ft(e, t, n, r) {
			P !== null && e.isNodeMaterial && P.setObject(r, e), Te === !0 && qe.setState(e, n, !1), e.transparent === !0 && e.side === 2 && e.forceSinglePass === !1 ? (e.side = 1, e.needsUpdate = !0, Ct(e, t, r), e.side = 0, e.needsUpdate = !0, Ct(e, t, r), e.side = 2) : Ct(e, t, r);
		}
		this.compile = function(e, t, n = null) {
			n === null && (n = e), P !== null && P.renderStart(e, t, n), k = Ge.get(n), k.init(t), ee.push(k), n.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (k.pushLight(e), e.castShadow && k.pushShadow(e));
			}), e !== n && e.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (k.pushLight(e), e.castShadow && k.pushShadow(e));
			}), k.setupLights(), P !== null && P.updateLights(k.state.lightsArray), Ee = this.localClippingEnabled, Te = qe.init(this.clippingPlanes, Ee), Te === !0 && qe.setGlobalState(this.clippingPlanes, t), P !== null && Je.render(k.state.shadowsArray, n, t);
			let r = /* @__PURE__ */ new Set();
			return e.traverse(function(e) {
				if (!(e.isMesh || e.isPoints || e.isLine || e.isSprite)) return;
				let i = e.material;
				if (i) {
					if (Array.isArray(i)) for (let a = 0; a < i.length; a++) {
						let o = i[a];
						ft(o, n, t, e), r.add(o);
					}
					else ft(i, n, t, e), r.add(i);
				}
			}), k = ee.pop(), P !== null && P.renderEnd(), r;
		}, this.compileAsync = function(e, t, n = null) {
			let r = this.compile(e, t, n);
			return new Promise((t) => {
				function n() {
					r.forEach(function(e) {
						let t = R.get(e).currentProgram;
						(t === void 0 || t.isReady()) && r.delete(e);
					}), r.size === 0 ? t(e) : setTimeout(n, 10);
				}
				Pe.get("KHR_parallel_shader_compile") === null ? setTimeout(n, 10) : n();
			});
		};
		let pt = null;
		function mt(e) {
			pt && pt(e);
		}
		function ht() {
			_t.stop();
		}
		function gt() {
			_t.start();
		}
		let _t = new $s();
		_t.setAnimationLoop(mt), typeof self < "u" && _t.setContext(self), this.setAnimationLoop = function(e) {
			pt = e, ot.setAnimationLoop(e), e === null ? _t.stop() : _t.start();
		}, ot.addEventListener("sessionstart", ht), ot.addEventListener("sessionend", gt), this.render = function(e, t) {
			if (t !== void 0 && t.isCamera !== !0) {
				V("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
				return;
			}
			if (re === !0) return;
			P !== null && P.renderStart(e, t);
			let n = ot.enabled === !0 && ot.isPresenting === !0, r = ne !== null && (F === null || n) && ne.begin(N, F);
			if (e.matrixWorldAutoUpdate === !0 && e.updateMatrixWorld(), t.parent === null && t.matrixWorldAutoUpdate === !0 && t.updateMatrixWorld(), ot.enabled === !0 && ot.isPresenting === !0 && (ne === null || ne.isCompositing() === !1) && (ot.cameraAutoUpdate === !0 && ot.updateCamera(t), t = ot.getCamera()), e.isScene === !0 && e.onBeforeRender(N, e, t, F), k = Ge.get(e, ee.length), k.init(t), k.state.textureUnits = z.getTextureUnits(), ee.push(k), De.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), we.setFromProjectionMatrix(De, Ke, t.reversedDepth), Ee = this.localClippingEnabled, Te = qe.init(this.clippingPlanes, Ee), O = We.get(e, A.length), O.init(), A.push(O), ot.enabled === !0 && ot.isPresenting === !0) {
				let e = N.xr.getDepthSensingMesh();
				e !== null && vt(e, t, -Infinity, N.sortObjects);
			}
			vt(e, t, 0, N.sortObjects), O.finish(), P !== null && P.updateLights(k.state.lightsArray), N.sortObjects === !0 && O.sort(ye, be), je = ot.enabled === !1 || ot.isPresenting === !1 || ot.hasDepthSensing() === !1, je && Ye.addToRenderList(O, e), this.info.render.frame++, this.info.autoReset === !0 && this.info.reset(), Te === !0 && qe.beginShadows();
			let i = k.state.shadowsArray;
			if (Je.render(i, e, t), Te === !0 && qe.endShadows(), (r && ne.hasRenderPass()) === !1) {
				let n = O.opaque, r = O.transmissive;
				if (k.setupLights(), t.isArrayCamera) {
					let i = t.cameras;
					if (r.length > 0) for (let t = 0, a = i.length; t < a; t++) {
						let a = i[t];
						bt(n, r, e, a);
					}
					je && Ye.render(e);
					for (let t = 0, n = i.length; t < n; t++) {
						let n = i[t];
						yt(O, e, n, n.viewport);
					}
				} else r.length > 0 && bt(n, r, e, t), je && Ye.render(e), yt(O, e, t);
			}
			F !== null && ce === 0 && (z.updateMultisampleRenderTarget(F), z.updateRenderTargetMipmap(F)), r && ne.end(N), e.isScene === !0 && e.onAfterRender(N, e, t), rt.resetDefaultState(), le = -1, ue = null, ee.pop(), ee.length > 0 ? (k = ee[ee.length - 1], z.setTextureUnits(k.state.textureUnits), Te === !0 && qe.setGlobalState(N.clippingPlanes, k.state.camera)) : k = null, A.pop(), O = A.length > 0 ? A[A.length - 1] : null, P !== null && P.renderEnd();
		};
		function vt(e, t, n, r) {
			if (e.visible === !1) return;
			if (e.layers.test(t.layers)) {
				if (e.isGroup) n = e.renderOrder;
				else if (e.isLOD) e.autoUpdate === !0 && e.update(t);
				else if (e.isLightProbeGrid) k.pushLightProbeGrid(e);
				else if (e.isLight) k.pushLight(e), e.castShadow && k.pushShadow(e);
				else if (e.isSprite) {
					if (!e.frustumCulled || e.intersectsFrustum(we)) {
						r && ke.setFromMatrixPosition(e.matrixWorld).applyMatrix4(De);
						let i = Ve.update(e), a = e.material;
						a.visible && O.push(e, i, a, n, ke.z, null, t);
					}
				} else if ((e.isMesh || e.isLine || e.isPoints) && (!e.frustumCulled || e.intersectsFrustum(we))) {
					let i = Ve.update(e), a = e.material;
					if (r && (e.boundingSphere === void 0 ? (i.boundingSphere === null && i.computeBoundingSphere(), ke.copy(i.boundingSphere.center)) : (e.boundingSphere === null && e.computeBoundingSphere(), ke.copy(e.boundingSphere.center)), ke.applyMatrix4(e.matrixWorld).applyMatrix4(De)), Array.isArray(a)) {
						let r = i.groups;
						for (let o = 0, s = r.length; o < s; o++) {
							let s = r[o], c = a[s.materialIndex];
							c && c.visible && O.push(e, i, c, n, ke.z, s, t);
						}
					} else a.visible && O.push(e, i, a, n, ke.z, null, t);
				}
			}
			let i = e.children;
			for (let e = 0, a = i.length; e < a; e++) vt(i[e], t, n, r);
		}
		function yt(e, t, n, r) {
			let { opaque: i, transmissive: a, transparent: o } = e;
			k.setupLightsView(n), Te === !0 && qe.setGlobalState(N.clippingPlanes, n), r && L.viewport(de.copy(r)), i.length > 0 && xt(i, t, n), a.length > 0 && xt(a, t, n), o.length > 0 && xt(o, t, n), L.buffers.depth.setTest(!0), L.buffers.depth.setMask(!0), L.buffers.color.setMask(!0), L.setPolygonOffset(!1);
		}
		function bt(e, t, n, r) {
			if ((n.isScene === !0 ? n.overrideMaterial : null) !== null) return;
			if (k.state.transmissionRenderTarget[r.id] === void 0) {
				let e = Pe.has("EXT_color_buffer_half_float") || Pe.has("EXT_color_buffer_float");
				k.state.transmissionRenderTarget[r.id] = new Yt(1, 1, {
					generateMipmaps: !0,
					type: e ? y : f,
					minFilter: d,
					samples: Math.max(4, Fe.samples),
					stencilBuffer: i,
					resolveDepthBuffer: !1,
					resolveStencilBuffer: !1,
					storeMultisampledDepthBuffer: !1,
					storeMultisampledStencilBuffer: !1,
					colorSpace: K.workingColorSpace
				});
			}
			let a = k.state.transmissionRenderTarget[r.id], o = r.viewport || de;
			a.setSize(o.z * N.transmissionResolutionScale, o.w * N.transmissionResolutionScale);
			let s = N.getRenderTarget(), c = N.getActiveCubeFace(), l = N.getActiveMipmapLevel();
			N.setRenderTarget(a), N.getClearColor(me), he = N.getClearAlpha(), he < 1 && N.setClearColor(16777215, .5), N.clear(), je && Ye.render(n);
			let u = N.toneMapping;
			N.toneMapping = 0;
			let p = r.viewport;
			if (r.viewport !== void 0 && (r.viewport = void 0), k.setupLightsView(r), Te === !0 && qe.setGlobalState(N.clippingPlanes, r), xt(e, n, r), z.updateMultisampleRenderTarget(a), z.updateRenderTargetMipmap(a), Pe.has("WEBGL_multisampled_render_to_texture") === !1) {
				let e = !1;
				for (let i = 0, a = t.length; i < a; i++) {
					let { object: a, geometry: o, material: s, group: c } = t[i];
					if (s.side === 2 && a.layers.test(r.layers)) {
						let t = s.side;
						s.side = 1, s.needsUpdate = !0, St(a, n, r, o, s, c), s.side = t, s.needsUpdate = !0, e = !0;
					}
				}
				e === !0 && (z.updateMultisampleRenderTarget(a), z.updateRenderTargetMipmap(a));
			}
			N.setRenderTarget(s, c, l), N.setClearColor(me, he), p !== void 0 && (r.viewport = p), N.toneMapping = u;
		}
		function xt(e, t, n) {
			let r = t.isScene === !0 ? t.overrideMaterial : null;
			for (let i = 0, a = e.length; i < a; i++) {
				let a = e[i], { object: o, geometry: s, group: c } = a, l = a.material;
				l.allowOverride === !0 && r !== null && (l = r), o.layers.test(n.layers) && St(o, t, n, s, l, c);
			}
		}
		function St(e, t, n, r, i, a) {
			P !== null && i.isNodeMaterial && P.setObject(e, i), e.onBeforeRender(N, t, n, r, i, a), e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, e.matrixWorld), e.normalMatrix.getNormalMatrix(e.modelViewMatrix), i.onBeforeRender(N, t, n, r, e, a), i.transparent === !0 && i.side === 2 && i.forceSinglePass === !1 ? (i.side = 1, i.needsUpdate = !0, N.renderBufferDirect(n, t, r, i, e, a), i.side = 0, i.needsUpdate = !0, N.renderBufferDirect(n, t, r, i, e, a), i.side = 2) : N.renderBufferDirect(n, t, r, i, e, a), e.onAfterRender(N, t, n, r, i, a);
		}
		function Ct(e, t, n) {
			t.isScene !== !0 && (t = Ae);
			let r = R.get(e), i = k.state.lights, a = k.state.shadowsArray, o = i.state.version, s = He.getParameters(e, i.state, a, t, n, k.state.lightProbeGridArray), c = He.getProgramCacheKey(s), l = r.programs;
			r.environment = e.isMeshStandardMaterial || e.isMeshLambertMaterial || e.isMeshPhongMaterial ? t.environment : null, r.fog = t.fog;
			let u = e.isMeshStandardMaterial || e.isMeshLambertMaterial && !e.envMap || e.isMeshPhongMaterial && !e.envMap;
			r.envMap = Le.get(e.envMap || r.environment, u), r.envMapRotation = r.environment !== null && e.envMap === null ? t.environmentRotation : e.envMapRotation, l === void 0 && (e.addEventListener("dispose", lt), l = /* @__PURE__ */ new Map(), r.programs = l);
			let d = l.get(c);
			if (d !== void 0) {
				if (r.currentProgram === d && r.lightsStateVersion === o) return Tt(e, s), d;
			} else s.uniforms = He.getUniforms(e), P !== null && e.isNodeMaterial && P.build(e, n, s), e.onBeforeCompile(s, N), d = He.acquireProgram(s, c), l.set(c, d), r.uniforms = s.uniforms;
			let f = r.uniforms;
			return (!e.isShaderMaterial && !e.isRawShaderMaterial || e.clipping === !0) && (f.clippingPlanes = qe.uniform), Tt(e, s), r.needsLights = kt(e), r.lightsStateVersion = o, r.needsLights && (f.ambientLightColor.value = i.state.ambient, f.lightProbe.value = i.state.probe, f.sunLights.value = i.state.sun, f.sunLightShadows.value = i.state.sunShadow, f.directionalLights.value = i.state.directional, f.directionalLightShadows.value = i.state.directionalShadow, f.spotLights.value = i.state.spot, f.spotLightShadows.value = i.state.spotShadow, f.rectAreaLights.value = i.state.rectArea, f.ltc_1.value = i.state.rectAreaLTC1, f.ltc_2.value = i.state.rectAreaLTC2, f.pointLights.value = i.state.point, f.pointLightShadows.value = i.state.pointShadow, f.hemisphereLights.value = i.state.hemi, f.sunShadowMatrix.value = i.state.sunShadowMatrix, f.sunShadowCascade.value = i.state.sunShadowCascade, f.directionalShadowMatrix.value = i.state.directionalShadowMatrix, f.spotLightMatrix.value = i.state.spotLightMatrix, f.spotLightMap.value = i.state.spotLightMap, f.pointShadowMatrix.value = i.state.pointShadowMatrix), r.lightProbeGrid = k.state.lightProbeGridArray.length > 0, r.currentProgram = d, r.uniformsList = null, d;
		}
		function wt(e) {
			if (e.uniformsList === null) {
				let t = e.currentProgram.getUniforms();
				e.uniformsList = ql.seqWithValue(t.seq, e.uniforms);
			}
			return e.uniformsList;
		}
		function Tt(e, t) {
			let n = R.get(e);
			n.outputColorSpace = t.outputColorSpace, n.batching = t.batching, n.batchingColor = t.batchingColor, n.instancing = t.instancing, n.instancingColor = t.instancingColor, n.instancingMorph = t.instancingMorph, n.skinning = t.skinning, n.morphTargets = t.morphTargets, n.morphNormals = t.morphNormals, n.morphColors = t.morphColors, n.morphTargetsCount = t.morphTargetsCount, n.numClippingPlanes = t.numClippingPlanes, n.numIntersection = t.numClipIntersection, n.vertexAlphas = t.vertexAlphas, n.vertexTangents = t.vertexTangents, n.toneMapping = t.toneMapping;
		}
		function Et(e, t) {
			if (e.length === 0) return null;
			if (e.length === 1) return e[0].texture === null ? null : e[0];
			D.setFromMatrixPosition(t.matrixWorld);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n.texture !== null && n.boundingBox.containsPoint(D)) return n;
			}
			return null;
		}
		function Dt(e, t, n, r, i) {
			t.isScene !== !0 && (t = Ae), z.resetTextureUnits();
			let a = t.fog, o = r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial ? t.environment : null, s = F === null ? N.outputColorSpace : F.isXRRenderTarget === !0 ? F.texture.colorSpace : K.workingColorSpace, c = r.isMeshStandardMaterial || r.isMeshLambertMaterial && !r.envMap || r.isMeshPhongMaterial && !r.envMap, l = Le.get(r.envMap || o, c), u = r.vertexColors === !0 && !!n.attributes.color && n.attributes.color.itemSize === 4, d = !!n.attributes.tangent && (!!r.normalMap || r.anisotropy > 0), f = !!n.morphAttributes.position, p = !!n.morphAttributes.normal, m = !!n.morphAttributes.color, h = 0;
			r.toneMapped && (F === null || F.isXRRenderTarget === !0) && (h = N.toneMapping);
			let g = n.morphAttributes.position || n.morphAttributes.normal || n.morphAttributes.color, _ = g === void 0 ? 0 : g.length, v = R.get(r), y = k.state.lights;
			if (Te === !0 && (Ee === !0 || e !== ue)) {
				let t = e === ue && r.id === le;
				qe.setState(r, e, t);
			}
			let b = !1;
			r.version === v.__version ? v.needsLights && v.lightsStateVersion !== y.state.version ? b = !0 : v.outputColorSpace === s ? i.isBatchedMesh && v.batching === !1 || !i.isBatchedMesh && v.batching === !0 || i.isBatchedMesh && v.batchingColor === !0 && i._colorsTexture === null || i.isBatchedMesh && v.batchingColor === !1 && i._colorsTexture !== null || i.isInstancedMesh && v.instancing === !1 || !i.isInstancedMesh && v.instancing === !0 || i.isSkinnedMesh && v.skinning === !1 || !i.isSkinnedMesh && v.skinning === !0 || i.isInstancedMesh && v.instancingColor === !0 && i.instanceColor === null || i.isInstancedMesh && v.instancingColor === !1 && i.instanceColor !== null || i.isInstancedMesh && v.instancingMorph === !0 && i.morphTexture === null || i.isInstancedMesh && v.instancingMorph === !1 && i.morphTexture !== null ? b = !0 : v.envMap === l ? r.fog === !0 && v.fog !== a || v.numClippingPlanes !== void 0 && (v.numClippingPlanes !== qe.numPlanes || v.numIntersection !== qe.numIntersection) ? b = !0 : v.vertexAlphas === u && v.vertexTangents === d && v.morphTargets === f && v.morphNormals === p && v.morphColors === m && v.toneMapping === h && v.morphTargetsCount === _ ? !!v.lightProbeGrid != k.state.lightProbeGridArray.length > 0 && (b = !0) : b = !0 : b = !0 : b = !0 : (b = !0, v.__version = r.version);
			let x = v.currentProgram;
			b === !0 && (x = Ct(r, t, i), P && r.isNodeMaterial && P.onUpdateProgram(r, x, v));
			let S = !1, C = !1, w = !1, T = x.getUniforms(), E = v.uniforms;
			if (L.useProgram(x.program) && (S = !0, C = !0, w = !0), r.id !== le && (le = r.id, C = !0), v.needsLights) {
				let e = Et(k.state.lightProbeGridArray, i);
				v.lightProbeGrid !== e && (v.lightProbeGrid = e, C = !0);
			}
			if (S || ue !== e) {
				L.buffers.depth.getReversed() && e.reversedDepth !== !0 && (e._reversedDepth = !0, e.updateProjectionMatrix()), T.setValue(I, "projectionMatrix", e.projectionMatrix), T.setValue(I, "viewMatrix", e.matrixWorldInverse);
				let t = T.map.cameraPosition;
				t !== void 0 && t.setValue(I, Oe.setFromMatrixPosition(e.matrixWorld)), Fe.logarithmicDepthBuffer && T.setValue(I, "logDepthBufFC", 2 / (Math.log(e.far + 1) / Math.LN2)), (r.isMeshPhongMaterial || r.isMeshToonMaterial || r.isMeshLambertMaterial || r.isMeshBasicMaterial || r.isMeshStandardMaterial || r.isShaderMaterial) && T.setValue(I, "isOrthographic", e.isOrthographicCamera === !0), ue !== e && (ue = e, C = !0, w = !0);
			}
			if (v.needsLights && (y.state.sunShadowMap.length > 0 && T.setValue(I, "sunShadowMap", y.state.sunShadowMap, z), y.state.directionalShadowMap.length > 0 && T.setValue(I, "directionalShadowMap", y.state.directionalShadowMap, z), y.state.spotShadowMap.length > 0 && T.setValue(I, "spotShadowMap", y.state.spotShadowMap, z), y.state.pointShadowMap.length > 0 && T.setValue(I, "pointShadowMap", y.state.pointShadowMap, z)), i.isSkinnedMesh) {
				T.setOptional(I, i, "bindMatrix"), T.setOptional(I, i, "bindMatrixInverse");
				let e = i.skeleton;
				e && (e.boneTexture === null && e.computeBoneTexture(), T.setValue(I, "boneTexture", e.boneTexture, z));
			}
			i.isBatchedMesh && (T.setOptional(I, i, "batchingTexture"), T.setValue(I, "batchingTexture", i._matricesTexture, z), T.setOptional(I, i, "batchingIdTexture"), T.setValue(I, "batchingIdTexture", i._indirectTexture, z), T.setOptional(I, i, "batchingColorTexture"), i._colorsTexture !== null && T.setValue(I, "batchingColorTexture", i._colorsTexture, z));
			let D = n.morphAttributes;
			if ((D.position !== void 0 || D.normal !== void 0 || D.color !== void 0) && Ze.update(i, n, x), (C || v.receiveShadow !== i.receiveShadow) && (v.receiveShadow = i.receiveShadow, T.setValue(I, "receiveShadow", i.receiveShadow)), (r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial) && r.envMap === null && t.environment !== null && (E.envMapIntensity.value = t.environmentIntensity), E.dfgLUT !== void 0 && (E.dfgLUT.value = md()), C) {
				if (T.setValue(I, "toneMappingExposure", N.toneMappingExposure), v.needsLights && Ot(E, w), a && r.fog === !0 && Ue.refreshFogUniforms(E, a), Ue.refreshMaterialUniforms(E, r, ve, _e, k.state.transmissionRenderTarget[e.id]), v.needsLights && v.lightProbeGrid) {
					let e = v.lightProbeGrid;
					E.probesSH.value = e.texture, E.probesMin.value.copy(e.boundingBox.min), E.probesMax.value.copy(e.boundingBox.max), E.probesResolution.value.copy(e.resolution);
				}
				ql.upload(I, wt(v), E, z);
			}
			if (r.isShaderMaterial && r.uniformsNeedUpdate === !0 && (ql.upload(I, wt(v), E, z), r.uniformsNeedUpdate = !1), r.isSpriteMaterial && T.setValue(I, "center", i.center), T.setValue(I, "modelViewMatrix", i.modelViewMatrix), T.setValue(I, "normalMatrix", i.normalMatrix), T.setValue(I, "modelMatrix", i.matrixWorld), r.uniformsGroups !== void 0) {
				let e = r.uniformsGroups;
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					it.update(n, x), it.bind(n, x);
				}
			}
			return x;
		}
		function Ot(e, t) {
			e.ambientLightColor.needsUpdate = t, e.lightProbe.needsUpdate = t, e.sunLights.needsUpdate = t, e.sunLightShadows.needsUpdate = t, e.directionalLights.needsUpdate = t, e.directionalLightShadows.needsUpdate = t, e.pointLights.needsUpdate = t, e.pointLightShadows.needsUpdate = t, e.spotLights.needsUpdate = t, e.spotLightShadows.needsUpdate = t, e.rectAreaLights.needsUpdate = t, e.hemisphereLights.needsUpdate = t;
		}
		function kt(e) {
			return e.isMeshLambertMaterial || e.isMeshToonMaterial || e.isMeshPhongMaterial || e.isMeshStandardMaterial || e.isShadowMaterial || e.isShaderMaterial && e.lights === !0;
		}
		this.getActiveCubeFace = function() {
			return se;
		}, this.getActiveMipmapLevel = function() {
			return ce;
		}, this.getRenderTarget = function() {
			return F;
		}, this.setRenderTargetTextures = function(e, t, n) {
			let r = R.get(e);
			r.__autoAllocateDepthBuffer = e.resolveDepthBuffer === !1, r.__autoAllocateDepthBuffer === !1 && (r.__useRenderToTexture = !1), R.get(e.texture).__webglTexture = t, R.get(e.depthTexture).__webglTexture = r.__autoAllocateDepthBuffer ? void 0 : n, r.__hasExternalTextures = !0;
		}, this.setRenderTargetFramebuffer = function(e, t) {
			let n = R.get(e);
			n.__webglFramebuffer = t, n.__useDefaultFramebuffer = t === void 0;
		}, this.setRenderTarget = function(e, t = 0, n = 0) {
			F = e, se = t, ce = n;
			let r = null, i = !1, a = !1;
			if (e) {
				let o = R.get(e);
				if (o.__useDefaultFramebuffer !== void 0) {
					L.bindFramebuffer(I.FRAMEBUFFER, o.__webglFramebuffer), de.copy(e.viewport), fe.copy(e.scissor), pe = e.scissorTest, L.viewport(de), L.scissor(fe), L.setScissorTest(pe), le = -1;
					return;
				}
				if (o.__webglFramebuffer === void 0) z.setupRenderTarget(e);
				else if (o.__hasExternalTextures) z.rebindTextures(e, R.get(e.texture).__webglTexture, R.get(e.depthTexture).__webglTexture);
				else if (e.depthBuffer) {
					let t = e.depthTexture;
					if (o.__boundDepthTexture !== t) {
						if (t !== null && R.has(t) && (e.width !== t.image.width || e.height !== t.image.height)) throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");
						z.setupDepthRenderbuffer(e);
					}
				}
				let s = e.texture;
				(s.isData3DTexture || s.isDataArrayTexture || s.isCompressedArrayTexture) && (a = !0);
				let c = R.get(e).__webglFramebuffer;
				e.isWebGLCubeRenderTarget ? (r = Array.isArray(c[t]) ? c[t][n] : c[t], i = !0) : r = e.samples > 0 && z.useMultisampledRTT(e) === !1 ? R.get(e).__webglMultisampledFramebuffer : Array.isArray(c) ? c[n] : c, de.copy(e.viewport), fe.copy(e.scissor), pe = e.scissorTest;
			} else de.copy(xe).multiplyScalar(ve).floor(), fe.copy(Se).multiplyScalar(ve).floor(), pe = Ce;
			if (n !== 0 && (r = ie), L.bindFramebuffer(I.FRAMEBUFFER, r) && L.drawBuffers(e, r), L.viewport(de), L.scissor(fe), L.setScissorTest(pe), i) {
				let r = R.get(e.texture);
				I.framebufferTexture2D(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_CUBE_MAP_POSITIVE_X + t, r.__webglTexture, n);
			} else if (a) {
				let r = t;
				for (let t = 0; t < e.textures.length; t++) {
					let i = R.get(e.textures[t]);
					I.framebufferTextureLayer(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0 + t, i.__webglTexture, n, r);
				}
			} else if (e !== null && n !== 0) {
				let t = R.get(e.texture);
				I.framebufferTexture2D(I.FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, t.__webglTexture, n);
			}
			le = -1;
		};
		function U(e) {
			let t = R.get(e);
			return (t.__readFormat !== e.format || t.__readType !== e.type) && (t.__readFormat = e.format, t.__readType = e.type, t.__formatReadable = Fe.textureFormatReadable(e.format), t.__typeReadable = Fe.textureTypeReadable(e.type)), t;
		}
		this.readRenderTargetPixels = function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) {
				V("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
				return;
			}
			let c = R.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				L.bindFramebuffer(I.FRAMEBUFFER, c);
				try {
					let o = e.textures[s], c = o.format, l = o.type;
					e.textures.length > 1 && I.readBuffer(I.COLOR_ATTACHMENT0 + s);
					let u = U(o);
					if (u.__formatReadable === !1) {
						V("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
						return;
					}
					if (u.__typeReadable === !1) {
						V("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
						return;
					}
					t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i && I.readPixels(t, n, r, i, nt.convert(c), nt.convert(l), a);
				} finally {
					let e = F === null ? null : R.get(F).__webglFramebuffer;
					L.bindFramebuffer(I.FRAMEBUFFER, e);
				}
			}
		}, this.readRenderTargetPixelsAsync = async function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
			let c = R.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				if (t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i) {
					L.bindFramebuffer(I.FRAMEBUFFER, c);
					let o = e.textures[s], l = o.format, u = o.type;
					e.textures.length > 1 && I.readBuffer(I.COLOR_ATTACHMENT0 + s);
					let d = U(o);
					if (d.__formatReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
					if (d.__typeReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
					let f = I.createBuffer();
					I.bindBuffer(I.PIXEL_PACK_BUFFER, f), I.bufferData(I.PIXEL_PACK_BUFFER, a.byteLength, I.STREAM_READ), I.readPixels(t, n, r, i, nt.convert(l), nt.convert(u), 0), I.bindBuffer(I.PIXEL_PACK_BUFFER, null);
					let p = F === null ? null : R.get(F).__webglFramebuffer;
					L.bindFramebuffer(I.FRAMEBUFFER, p);
					let m = I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE, 0);
					return I.flush(), await tt(I, m, 4), I.bindBuffer(I.PIXEL_PACK_BUFFER, f), I.getBufferSubData(I.PIXEL_PACK_BUFFER, 0, a), I.bindBuffer(I.PIXEL_PACK_BUFFER, null), I.deleteBuffer(f), I.deleteSync(m), a;
				}
				throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
			}
		}, this.copyFramebufferToTexture = function(e, t = null, n = 0) {
			let r = 2 ** -n, i = Math.floor(e.image.width * r), a = Math.floor(e.image.height * r), o = t === null ? 0 : t.x, s = t === null ? 0 : t.y;
			z.setTexture2D(e, 0), I.copyTexSubImage2D(I.TEXTURE_2D, n, 0, 0, o, s, i, a), L.unbindTexture();
		}, this.copyTextureToTexture = function(e, t, n = null, r = null, i = 0, a = 0) {
			let o, s, c, l, u, d, f, p, m, h = e.isCompressedTexture ? e.mipmaps[a] : e.image;
			if (n !== null) o = n.max.x - n.min.x, s = n.max.y - n.min.y, c = n.isBox3 ? n.max.z - n.min.z : 1, l = n.min.x, u = n.min.y, d = n.isBox3 ? n.min.z : 0;
			else {
				let t = 2 ** -i;
				o = Math.floor(h.width * t), s = Math.floor(h.height * t), c = e.isDataArrayTexture ? h.depth : e.isData3DTexture ? Math.floor(h.depth * t) : 1, l = 0, u = 0, d = 0;
			}
			r === null ? (f = 0, p = 0, m = 0) : (f = r.x, p = r.y, m = r.z);
			let g = nt.convert(t.format), _ = nt.convert(t.type), v;
			t.isData3DTexture ? (z.setTexture3D(t, 0), v = I.TEXTURE_3D) : t.isDataArrayTexture || t.isCompressedArrayTexture ? (z.setTexture2DArray(t, 0), v = I.TEXTURE_2D_ARRAY) : (z.setTexture2D(t, 0), v = I.TEXTURE_2D), L.activeTexture(I.TEXTURE0), L.pixelStorei(I.UNPACK_FLIP_Y_WEBGL, t.flipY), L.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), L.pixelStorei(I.UNPACK_ALIGNMENT, t.unpackAlignment);
			let y = L.getParameter(I.UNPACK_ROW_LENGTH), b = L.getParameter(I.UNPACK_IMAGE_HEIGHT), x = L.getParameter(I.UNPACK_SKIP_PIXELS), S = L.getParameter(I.UNPACK_SKIP_ROWS), C = L.getParameter(I.UNPACK_SKIP_IMAGES);
			L.pixelStorei(I.UNPACK_ROW_LENGTH, h.width), L.pixelStorei(I.UNPACK_IMAGE_HEIGHT, h.height), L.pixelStorei(I.UNPACK_SKIP_PIXELS, l), L.pixelStorei(I.UNPACK_SKIP_ROWS, u), L.pixelStorei(I.UNPACK_SKIP_IMAGES, d);
			let w = e.isDataArrayTexture || e.isData3DTexture, T = t.isDataArrayTexture || t.isData3DTexture;
			if (e.isDepthTexture) {
				let n = R.get(e), r = R.get(t), h = R.get(n.__renderTarget), g = R.get(r.__renderTarget);
				L.bindFramebuffer(I.READ_FRAMEBUFFER, h.__webglFramebuffer), L.bindFramebuffer(I.DRAW_FRAMEBUFFER, g.__webglFramebuffer);
				for (let n = 0; n < c; n++) w && (I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, R.get(e).__webglTexture, i, d + n), I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, R.get(t).__webglTexture, a, m + n)), I.blitFramebuffer(l, u, o, s, f, p, o, s, I.DEPTH_BUFFER_BIT, I.NEAREST);
				L.bindFramebuffer(I.READ_FRAMEBUFFER, null), L.bindFramebuffer(I.DRAW_FRAMEBUFFER, null);
			} else if (i !== 0 || e.isRenderTargetTexture || R.has(e)) {
				let n = R.get(e), r = R.get(t);
				L.bindFramebuffer(I.READ_FRAMEBUFFER, ae), L.bindFramebuffer(I.DRAW_FRAMEBUFFER, oe);
				for (let e = 0; e < c; e++) w ? I.framebufferTextureLayer(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, n.__webglTexture, i, d + e) : I.framebufferTexture2D(I.READ_FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, n.__webglTexture, i), T ? I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, r.__webglTexture, a, m + e) : I.framebufferTexture2D(I.DRAW_FRAMEBUFFER, I.COLOR_ATTACHMENT0, I.TEXTURE_2D, r.__webglTexture, a), i === 0 ? T ? I.copyTexSubImage3D(v, a, f, p, m + e, l, u, o, s) : I.copyTexSubImage2D(v, a, f, p, l, u, o, s) : I.blitFramebuffer(l, u, o, s, f, p, o, s, I.COLOR_BUFFER_BIT, I.NEAREST);
				L.bindFramebuffer(I.READ_FRAMEBUFFER, null), L.bindFramebuffer(I.DRAW_FRAMEBUFFER, null);
			} else T ? e.isDataTexture || e.isData3DTexture ? I.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h.data) : t.isCompressedArrayTexture ? I.compressedTexSubImage3D(v, a, f, p, m, o, s, c, g, h.data) : I.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h) : e.isDataTexture ? I.texSubImage2D(I.TEXTURE_2D, a, f, p, o, s, g, _, h.data) : e.isCompressedTexture ? I.compressedTexSubImage2D(I.TEXTURE_2D, a, f, p, h.width, h.height, g, h.data) : I.texSubImage2D(I.TEXTURE_2D, a, f, p, o, s, g, _, h);
			L.pixelStorei(I.UNPACK_ROW_LENGTH, y), L.pixelStorei(I.UNPACK_IMAGE_HEIGHT, b), L.pixelStorei(I.UNPACK_SKIP_PIXELS, x), L.pixelStorei(I.UNPACK_SKIP_ROWS, S), L.pixelStorei(I.UNPACK_SKIP_IMAGES, C), a === 0 && t.generateMipmaps && I.generateMipmap(v), L.unbindTexture();
		}, this.initRenderTarget = function(e) {
			R.get(e).__webglFramebuffer === void 0 && z.setupRenderTarget(e);
		}, this.initTexture = function(e) {
			e.isCubeTexture ? z.setTextureCube(e, 0) : e.isData3DTexture ? z.setTexture3D(e, 0) : e.isDataArrayTexture || e.isCompressedArrayTexture ? z.setTexture2DArray(e, 0) : z.setTexture2D(e, 0), L.unbindTexture();
		}, this.resetState = function() {
			se = 0, ce = 0, F = null, L.reset(), rt.reset();
		}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	get coordinateSystem() {
		return Ke;
	}
	get outputColorSpace() {
		return this._outputColorSpace;
	}
	set outputColorSpace(e) {
		this._outputColorSpace = e;
		let t = this.getContext();
		t.drawingBufferColorSpace = K._getDrawingBufferColorSpace(e), t.unpackColorSpace = K._getUnpackColorSpace();
	}
}, gd = { type: "change" }, _d = { type: "start" }, vd = { type: "end" }, yd = new Hr(), bd = new Fr(), xd = Math.cos(70 * kt.DEG2RAD), Sd = new W(), Cd = 2 * Math.PI, wd = {
	NONE: -1,
	ROTATE: 0,
	DOLLY: 1,
	PAN: 2,
	TOUCH_ROTATE: 3,
	TOUCH_PAN: 4,
	TOUCH_DOLLY_PAN: 5,
	TOUCH_DOLLY_ROTATE: 6
}, Td = 1e-6, Ed = class extends Xs {
	constructor(n, r = null) {
		super(n, r), this.state = wd.NONE, this.target = new W(), this.cursor = new W(), this.minDistance = 0, this.maxDistance = Infinity, this.minZoom = 0, this.maxZoom = Infinity, this.minTargetRadius = 0, this.maxTargetRadius = Infinity, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -Infinity, this.maxAzimuthAngle = Infinity, this.enableDamping = !1, this.dampingFactor = .05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.keyRotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.zoomToCursor = !1, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = {
			LEFT: "ArrowLeft",
			UP: "ArrowUp",
			RIGHT: "ArrowRight",
			BOTTOM: "ArrowDown"
		}, this.mouseButtons = {
			LEFT: e.ROTATE,
			MIDDLE: e.DOLLY,
			RIGHT: e.PAN
		}, this.touches = {
			ONE: t.ROTATE,
			TWO: t.DOLLY_PAN
		}, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._cursorStyle = "auto", this._domElementKeyEvents = null, this._lastPosition = new W(), this._lastQuaternion = new At(), this._lastTargetPosition = new W(), this._quat = new At().setFromUnitVectors(n.up, new W(0, 1, 0)), this._quatInverse = this._quat.clone().invert(), this._spherical = new Vs(), this._sphericalDelta = new Vs(), this._scale = 1, this._panOffset = new W(), this._rotateStart = new U(), this._rotateEnd = new U(), this._rotateDelta = new U(), this._panStart = new U(), this._panEnd = new U(), this._panDelta = new U(), this._dollyStart = new U(), this._dollyEnd = new U(), this._dollyDelta = new U(), this._dollyDirection = new W(), this._mouse = new U(), this._performCursorZoom = !1, this._pointers = [], this._pointerPositions = {}, this._controlActive = !1, this._onPointerMove = Od.bind(this), this._onPointerDown = Dd.bind(this), this._onPointerUp = kd.bind(this), this._onContextMenu = Id.bind(this), this._onMouseWheel = Md.bind(this), this._onKeyDown = Nd.bind(this), this._onTouchStart = Pd.bind(this), this._onTouchMove = Fd.bind(this), this._onMouseDown = Ad.bind(this), this._onMouseMove = jd.bind(this), this._interceptControlDown = Ld.bind(this), this._interceptControlUp = Rd.bind(this), this.domElement !== null && this.connect(this.domElement), this.update();
	}
	set cursorStyle(e) {
		this._cursorStyle = e, e === "grab" ? this.domElement.style.cursor = "grab" : this.domElement.style.cursor = "auto";
	}
	get cursorStyle() {
		return this._cursorStyle;
	}
	connect(e) {
		super.connect(e), this.domElement.addEventListener("pointerdown", this._onPointerDown), this.domElement.addEventListener("pointercancel", this._onPointerUp), this.domElement.addEventListener("contextmenu", this._onContextMenu), this.domElement.addEventListener("wheel", this._onMouseWheel, { passive: !1 }), this.domElement.getRootNode().addEventListener("keydown", this._interceptControlDown, {
			passive: !0,
			capture: !0
		}), this.domElement.style.touchAction = "none";
	}
	disconnect() {
		this.state = wd.NONE, this.domElement.removeEventListener("pointerdown", this._onPointerDown), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.domElement.removeEventListener("pointercancel", this._onPointerUp), this.domElement.removeEventListener("wheel", this._onMouseWheel), this.domElement.removeEventListener("contextmenu", this._onContextMenu), this.stopListenToKeyEvents();
		let e = this.domElement.getRootNode();
		e.removeEventListener("keydown", this._interceptControlDown, { capture: !0 }), e.removeEventListener("keyup", this._interceptControlUp, { capture: !0 }), this._controlActive = !1, this._pointers.length = 0, this._pointerPositions = {}, this.domElement.style.touchAction = "", this.domElement.style.cursor = "auto";
	}
	dispose() {
		this.disconnect();
	}
	getPolarAngle() {
		return this._spherical.phi;
	}
	getAzimuthalAngle() {
		return this._spherical.theta;
	}
	getDistance() {
		return this.object.position.distanceTo(this.target);
	}
	listenToKeyEvents(e) {
		e.addEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = e;
	}
	stopListenToKeyEvents() {
		this._domElementKeyEvents !== null && (this._domElementKeyEvents.removeEventListener("keydown", this._onKeyDown), this._domElementKeyEvents = null);
	}
	saveState() {
		this.target0.copy(this.target), this.position0.copy(this.object.position), this.zoom0 = this.object.zoom;
	}
	reset() {
		this.target.copy(this.target0), this.object.position.copy(this.position0), this.object.zoom = this.zoom0, this.object.updateProjectionMatrix(), this.dispatchEvent(gd), this.update(), this.state = wd.NONE;
	}
	pan(e, t) {
		this._pan(e, t), this.update();
	}
	dollyIn(e) {
		this._dollyIn(e), this.update();
	}
	dollyOut(e) {
		this._dollyOut(e), this.update();
	}
	rotateLeft(e) {
		this._rotateLeft(e), this.update();
	}
	rotateUp(e) {
		this._rotateUp(e), this.update();
	}
	update(e = null) {
		let t = this.object.position;
		Sd.copy(t).sub(this.target), Sd.applyQuaternion(this._quat), this._spherical.setFromVector3(Sd), this.autoRotate && this.state === wd.NONE && this._rotateLeft(this._getAutoRotationAngle(e)), this.enableDamping ? (this._spherical.theta += this._sphericalDelta.theta * this.dampingFactor, this._spherical.phi += this._sphericalDelta.phi * this.dampingFactor) : (this._spherical.theta += this._sphericalDelta.theta, this._spherical.phi += this._sphericalDelta.phi);
		let n = this.minAzimuthAngle, r = this.maxAzimuthAngle;
		isFinite(n) && isFinite(r) && (n < -Math.PI ? n += Cd : n > Math.PI && (n -= Cd), r < -Math.PI ? r += Cd : r > Math.PI && (r -= Cd), n <= r ? this._spherical.theta = Math.max(n, Math.min(r, this._spherical.theta)) : this._spherical.theta = this._spherical.theta > (n + r) / 2 ? Math.max(n, this._spherical.theta) : Math.min(r, this._spherical.theta)), this._spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._spherical.phi)), this._spherical.makeSafe(), this.enableDamping === !0 ? this.target.addScaledVector(this._panOffset, this.dampingFactor) : this.target.add(this._panOffset), this.target.sub(this.cursor), this.target.clampLength(this.minTargetRadius, this.maxTargetRadius), this.target.add(this.cursor);
		let i = !1;
		if (this.zoomToCursor && this._performCursorZoom || this.object.isOrthographicCamera) this._spherical.radius = this._clampDistance(this._spherical.radius);
		else {
			let e = this._spherical.radius;
			this._spherical.radius = this._clampDistance(this._spherical.radius * this._scale), i = e != this._spherical.radius;
		}
		if (Sd.setFromSpherical(this._spherical), Sd.applyQuaternion(this._quatInverse), t.copy(this.target).add(Sd), this.object.lookAt(this.target), this.enableDamping === !0 ? (this._sphericalDelta.theta *= 1 - this.dampingFactor, this._sphericalDelta.phi *= 1 - this.dampingFactor, this._panOffset.multiplyScalar(1 - this.dampingFactor)) : (this._sphericalDelta.set(0, 0, 0), this._panOffset.set(0, 0, 0)), this.zoomToCursor && this._performCursorZoom) {
			let e = null;
			if (this.object.isPerspectiveCamera) {
				let t = Sd.length();
				e = this._clampDistance(t * this._scale);
				let n = t - e;
				this.object.position.addScaledVector(this._dollyDirection, n), this.object.updateMatrixWorld(), i = !!n;
			} else if (this.object.isOrthographicCamera) {
				let t = new W(this._mouse.x, this._mouse.y, 0);
				t.unproject(this.object);
				let n = this.object.zoom;
				this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), this.object.updateProjectionMatrix(), i = n !== this.object.zoom;
				let r = new W(this._mouse.x, this._mouse.y, 0);
				r.unproject(this.object), this.object.position.sub(r).add(t), this.object.updateMatrixWorld(), e = Sd.length();
			} else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."), this.zoomToCursor = !1;
			e !== null && (this.screenSpacePanning ? this.target.set(0, 0, -1).transformDirection(this.object.matrix).multiplyScalar(e).add(this.object.position) : (yd.origin.copy(this.object.position), yd.direction.set(0, 0, -1).transformDirection(this.object.matrix), Math.abs(this.object.up.dot(yd.direction)) < xd ? this.object.lookAt(this.target) : (bd.setFromNormalAndCoplanarPoint(this.object.up, this.target), yd.intersectPlane(bd, this.target))));
		} else if (this.object.isOrthographicCamera) {
			let e = this.object.zoom;
			this.object.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.object.zoom / this._scale)), e !== this.object.zoom && (this.object.updateProjectionMatrix(), i = !0);
		}
		return this._scale = 1, this._performCursorZoom = !1, i || this._lastPosition.distanceToSquared(this.object.position) > Td || 8 * (1 - this._lastQuaternion.dot(this.object.quaternion)) > Td || this._lastTargetPosition.distanceToSquared(this.target) > Td ? (this.dispatchEvent(gd), this._lastPosition.copy(this.object.position), this._lastQuaternion.copy(this.object.quaternion), this._lastTargetPosition.copy(this.target), !0) : !1;
	}
	_getAutoRotationAngle(e) {
		return e === null ? Cd / 60 / 60 * this.autoRotateSpeed : Cd / 60 * this.autoRotateSpeed * e;
	}
	_getZoomScale(e) {
		let t = Math.abs(e * .01);
		return .95 ** (this.zoomSpeed * t);
	}
	_rotateLeft(e) {
		this._sphericalDelta.theta -= e;
	}
	_rotateUp(e) {
		this._sphericalDelta.phi -= e;
	}
	_panLeft(e, t) {
		Sd.setFromMatrixColumn(t, 0), Sd.multiplyScalar(-e), this._panOffset.add(Sd);
	}
	_panUp(e, t) {
		this.screenSpacePanning === !0 ? Sd.setFromMatrixColumn(t, 1) : (Sd.setFromMatrixColumn(t, 0), Sd.crossVectors(this.object.up, Sd)), Sd.multiplyScalar(e), this._panOffset.add(Sd);
	}
	_pan(e, t) {
		let n = this.domElement;
		if (this.object.isPerspectiveCamera) {
			let r = this.object.position;
			Sd.copy(r).sub(this.target);
			let i = Sd.length();
			i *= Math.tan(this.object.fov / 2 * Math.PI / 180), this._panLeft(2 * e * i / n.clientHeight, this.object.matrix), this._panUp(2 * t * i / n.clientHeight, this.object.matrix);
		} else this.object.isOrthographicCamera ? (this._panLeft(e * (this.object.right - this.object.left) / this.object.zoom / n.clientWidth, this.object.matrix), this._panUp(t * (this.object.top - this.object.bottom) / this.object.zoom / n.clientHeight, this.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), this.enablePan = !1);
	}
	_dollyOut(e) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale /= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
	}
	_dollyIn(e) {
		this.object.isPerspectiveCamera || this.object.isOrthographicCamera ? this._scale *= e : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), this.enableZoom = !1);
	}
	_updateZoomParameters(e, t) {
		if (!this.zoomToCursor) return;
		this._performCursorZoom = !0;
		let n = this.domElement.getBoundingClientRect(), r = e - n.left, i = t - n.top, a = n.width, o = n.height;
		this._mouse.x = r / a * 2 - 1, this._mouse.y = -(i / o) * 2 + 1, this._dollyDirection.set(this._mouse.x, this._mouse.y, 1).unproject(this.object).sub(this.object.position).normalize();
	}
	_clampDistance(e) {
		return Math.max(this.minDistance, Math.min(this.maxDistance, e));
	}
	_handleMouseDownRotate(e) {
		this._rotateStart.set(e.clientX, e.clientY);
	}
	_handleMouseDownDolly(e) {
		this._updateZoomParameters(e.clientX, e.clientX), this._dollyStart.set(e.clientX, e.clientY);
	}
	_handleMouseDownPan(e) {
		this._panStart.set(e.clientX, e.clientY);
	}
	_handleMouseMoveRotate(e) {
		this._rotateEnd.set(e.clientX, e.clientY), this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
		let t = this.domElement;
		this._rotateLeft(Cd * this._rotateDelta.x / t.clientHeight), this._rotateUp(Cd * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd), this.update();
	}
	_handleMouseMoveDolly(e) {
		this._dollyEnd.set(e.clientX, e.clientY), this._dollyDelta.subVectors(this._dollyEnd, this._dollyStart), this._dollyDelta.y > 0 ? this._dollyOut(this._getZoomScale(this._dollyDelta.y)) : this._dollyDelta.y < 0 && this._dollyIn(this._getZoomScale(this._dollyDelta.y)), this._dollyStart.copy(this._dollyEnd), this.update();
	}
	_handleMouseMovePan(e) {
		this._panEnd.set(e.clientX, e.clientY), this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd), this.update();
	}
	_handleMouseWheel(e) {
		this._updateZoomParameters(e.clientX, e.clientY), e.deltaY < 0 ? this._dollyIn(this._getZoomScale(e.deltaY)) : e.deltaY > 0 && this._dollyOut(this._getZoomScale(e.deltaY)), this.update();
	}
	_handleKeyDown(e) {
		let t = !1;
		switch (e.code) {
			case this.keys.UP:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(Cd * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, this.keyPanSpeed), t = !0;
				break;
			case this.keys.BOTTOM:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateUp(-Cd * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(0, -this.keyPanSpeed), t = !0;
				break;
			case this.keys.LEFT:
				e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(Cd * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(this.keyPanSpeed, 0), t = !0;
				break;
			case this.keys.RIGHT: e.ctrlKey || e.metaKey || e.shiftKey ? this.enableRotate && this._rotateLeft(-Cd * this.keyRotateSpeed / this.domElement.clientHeight) : this.enablePan && this._pan(-this.keyPanSpeed, 0), t = !0;
		}
		t && (e.preventDefault(), this.update());
	}
	_handleTouchStartRotate(e) {
		if (this._pointers.length === 1) this._rotateStart.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._rotateStart.set(n, r);
		}
	}
	_handleTouchStartPan(e) {
		if (this._pointers.length === 1) this._panStart.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._panStart.set(n, r);
		}
	}
	_handleTouchStartDolly(e) {
		let t = this._getSecondPointerPosition(e), n = e.pageX - t.x, r = e.pageY - t.y, i = Math.sqrt(n * n + r * r);
		this._dollyStart.set(0, i);
	}
	_handleTouchStartDollyPan(e) {
		this.enableZoom && this._handleTouchStartDolly(e), this.enablePan && this._handleTouchStartPan(e);
	}
	_handleTouchStartDollyRotate(e) {
		this.enableZoom && this._handleTouchStartDolly(e), this.enableRotate && this._handleTouchStartRotate(e);
	}
	_handleTouchMoveRotate(e) {
		if (this._pointers.length == 1) this._rotateEnd.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._rotateEnd.set(n, r);
		}
		this._rotateDelta.subVectors(this._rotateEnd, this._rotateStart).multiplyScalar(this.rotateSpeed);
		let t = this.domElement;
		this._rotateLeft(Cd * this._rotateDelta.x / t.clientHeight), this._rotateUp(Cd * this._rotateDelta.y / t.clientHeight), this._rotateStart.copy(this._rotateEnd);
	}
	_handleTouchMovePan(e) {
		if (this._pointers.length === 1) this._panEnd.set(e.pageX, e.pageY);
		else {
			let t = this._getSecondPointerPosition(e), n = .5 * (e.pageX + t.x), r = .5 * (e.pageY + t.y);
			this._panEnd.set(n, r);
		}
		this._panDelta.subVectors(this._panEnd, this._panStart).multiplyScalar(this.panSpeed), this._pan(this._panDelta.x, this._panDelta.y), this._panStart.copy(this._panEnd);
	}
	_handleTouchMoveDolly(e) {
		let t = this._getSecondPointerPosition(e), n = e.pageX - t.x, r = e.pageY - t.y, i = Math.sqrt(n * n + r * r);
		this._dollyEnd.set(0, i), this._dollyDelta.set(0, (this._dollyEnd.y / this._dollyStart.y) ** +this.zoomSpeed), this._dollyOut(this._dollyDelta.y), this._dollyStart.copy(this._dollyEnd);
		let a = (e.pageX + t.x) * .5, o = (e.pageY + t.y) * .5;
		this._updateZoomParameters(a, o);
	}
	_handleTouchMoveDollyPan(e) {
		this.enableZoom && this._handleTouchMoveDolly(e), this.enablePan && this._handleTouchMovePan(e);
	}
	_handleTouchMoveDollyRotate(e) {
		this.enableZoom && this._handleTouchMoveDolly(e), this.enableRotate && this._handleTouchMoveRotate(e);
	}
	_addPointer(e) {
		this._pointers.push(e.pointerId);
	}
	_removePointer(e) {
		delete this._pointerPositions[e.pointerId];
		for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) {
			this._pointers.splice(t, 1);
			return;
		}
	}
	_isTrackingPointer(e) {
		for (let t = 0; t < this._pointers.length; t++) if (this._pointers[t] == e.pointerId) return !0;
		return !1;
	}
	_trackPointer(e) {
		let t = this._pointerPositions[e.pointerId];
		t === void 0 && (t = new U(), this._pointerPositions[e.pointerId] = t), t.set(e.pageX, e.pageY);
	}
	_getSecondPointerPosition(e) {
		let t = e.pointerId === this._pointers[0] ? this._pointers[1] : this._pointers[0];
		return this._pointerPositions[t];
	}
	_customWheelEvent(e) {
		let t = e.deltaMode, n = {
			clientX: e.clientX,
			clientY: e.clientY,
			deltaY: e.deltaY
		};
		switch (t) {
			case 1:
				n.deltaY *= 16;
				break;
			case 2: n.deltaY *= 100;
		}
		return e.ctrlKey && !this._controlActive && (n.deltaY *= 10), n;
	}
};
function Dd(e) {
	this.enabled !== !1 && (this._pointers.length === 0 && (this.domElement.setPointerCapture(e.pointerId), this.domElement.ownerDocument.addEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.addEventListener("pointerup", this._onPointerUp)), !this._isTrackingPointer(e) && (this._addPointer(e), e.pointerType === "touch" ? this._onTouchStart(e) : this._onMouseDown(e), this._cursorStyle === "grab" && (this.domElement.style.cursor = "grabbing")));
}
function Od(e) {
	this.enabled !== !1 && (e.pointerType === "touch" ? this._onTouchMove(e) : this._onMouseMove(e));
}
function kd(e) {
	switch (this._removePointer(e), this._pointers.length) {
		case 0:
			this.domElement.releasePointerCapture(e.pointerId), this.domElement.ownerDocument.removeEventListener("pointermove", this._onPointerMove), this.domElement.ownerDocument.removeEventListener("pointerup", this._onPointerUp), this.dispatchEvent(vd), this.state = wd.NONE, this._cursorStyle === "grab" && (this.domElement.style.cursor = "grab");
			break;
		case 1:
			let t = this._pointers[0], n = this._pointerPositions[t];
			this._onTouchStart({
				pointerId: t,
				pageX: n.x,
				pageY: n.y
			});
	}
}
function Ad(t) {
	let n;
	switch (t.button) {
		case 0:
			n = this.mouseButtons.LEFT;
			break;
		case 1:
			n = this.mouseButtons.MIDDLE;
			break;
		case 2:
			n = this.mouseButtons.RIGHT;
			break;
		default: n = -1;
	}
	switch (n) {
		case e.DOLLY:
			if (this.enableZoom === !1) return;
			this._handleMouseDownDolly(t), this.state = wd.DOLLY;
			break;
		case e.ROTATE:
			if (t.ctrlKey || t.metaKey || t.shiftKey) {
				if (this.enablePan === !1) return;
				this._handleMouseDownPan(t), this.state = wd.PAN;
			} else {
				if (this.enableRotate === !1) return;
				this._handleMouseDownRotate(t), this.state = wd.ROTATE;
			}
			break;
		case e.PAN:
			if (t.ctrlKey || t.metaKey || t.shiftKey) {
				if (this.enableRotate === !1) return;
				this._handleMouseDownRotate(t), this.state = wd.ROTATE;
			} else {
				if (this.enablePan === !1) return;
				this._handleMouseDownPan(t), this.state = wd.PAN;
			}
			break;
		default: this.state = wd.NONE;
	}
	this.state !== wd.NONE && this.dispatchEvent(_d);
}
function jd(e) {
	switch (this.state) {
		case wd.ROTATE:
			if (this.enableRotate === !1) return;
			this._handleMouseMoveRotate(e);
			break;
		case wd.DOLLY:
			if (this.enableZoom === !1) return;
			this._handleMouseMoveDolly(e);
			break;
		case wd.PAN:
			if (this.enablePan === !1) return;
			this._handleMouseMovePan(e);
	}
}
function Md(e) {
	this.enabled !== !1 && this.enableZoom !== !1 && this.state === wd.NONE && (e.preventDefault(), this.dispatchEvent(_d), this._handleMouseWheel(this._customWheelEvent(e)), this.dispatchEvent(vd));
}
function Nd(e) {
	this.enabled !== !1 && this._handleKeyDown(e);
}
function Pd(e) {
	switch (this._trackPointer(e), this._pointers.length) {
		case 1:
			switch (this.touches.ONE) {
				case t.ROTATE:
					if (this.enableRotate === !1) return;
					this._handleTouchStartRotate(e), this.state = wd.TOUCH_ROTATE;
					break;
				case t.PAN:
					if (this.enablePan === !1) return;
					this._handleTouchStartPan(e), this.state = wd.TOUCH_PAN;
					break;
				default: this.state = wd.NONE;
			}
			break;
		case 2:
			switch (this.touches.TWO) {
				case t.DOLLY_PAN:
					if (this.enableZoom === !1 && this.enablePan === !1) return;
					this._handleTouchStartDollyPan(e), this.state = wd.TOUCH_DOLLY_PAN;
					break;
				case t.DOLLY_ROTATE:
					if (this.enableZoom === !1 && this.enableRotate === !1) return;
					this._handleTouchStartDollyRotate(e), this.state = wd.TOUCH_DOLLY_ROTATE;
					break;
				default: this.state = wd.NONE;
			}
			break;
		default: this.state = wd.NONE;
	}
	this.state !== wd.NONE && this.dispatchEvent(_d);
}
function Fd(e) {
	switch (this._trackPointer(e), this.state) {
		case wd.TOUCH_ROTATE:
			if (this.enableRotate === !1) return;
			this._handleTouchMoveRotate(e), this.update();
			break;
		case wd.TOUCH_PAN:
			if (this.enablePan === !1) return;
			this._handleTouchMovePan(e), this.update();
			break;
		case wd.TOUCH_DOLLY_PAN:
			if (this.enableZoom === !1 && this.enablePan === !1) return;
			this._handleTouchMoveDollyPan(e), this.update();
			break;
		case wd.TOUCH_DOLLY_ROTATE:
			if (this.enableZoom === !1 && this.enableRotate === !1) return;
			this._handleTouchMoveDollyRotate(e), this.update();
			break;
		default: this.state = wd.NONE;
	}
}
function Id(e) {
	this.enabled !== !1 && e.preventDefault();
}
function Ld(e) {
	e.key === "Control" && (this._controlActive = !0, this.domElement.getRootNode().addEventListener("keyup", this._interceptControlUp, {
		passive: !0,
		capture: !0
	}));
}
function Rd(e) {
	e.key === "Control" && (this._controlActive = !1, this.domElement.getRootNode().removeEventListener("keyup", this._interceptControlUp, {
		passive: !0,
		capture: !0
	}));
}
// node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function zd(e, t) {
	if (t === 0) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === 2 || t === 1) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === 2) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		return i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."), e.setIndex(i), e.clearGroups(), e;
	}
	return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
// node_modules/three/examples/jsm/utils/SkeletonUtils.js
function Bd(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return Vd(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function Vd(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) Vd(e.children[r], t.children[r], n);
}
// node_modules/three/examples/jsm/loaders/GLTFLoader.js
var Hd = class extends Wo {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new Jd(e);
		}), this.register(function(e) {
			return new Yd(e);
		}), this.register(function(e) {
			return new af(e);
		}), this.register(function(e) {
			return new of(e);
		}), this.register(function(e) {
			return new sf(e);
		}), this.register(function(e) {
			return new Zd(e);
		}), this.register(function(e) {
			return new Qd(e);
		}), this.register(function(e) {
			return new $d(e);
		}), this.register(function(e) {
			return new ef(e);
		}), this.register(function(e) {
			return new qd(e);
		}), this.register(function(e) {
			return new tf(e);
		}), this.register(function(e) {
			return new Xd(e);
		}), this.register(function(e) {
			return new rf(e);
		}), this.register(function(e) {
			return new nf(e);
		}), this.register(function(e) {
			return new Gd(e);
		}), this.register(function(e) {
			return new cf(e, Z.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new cf(e, Z.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new lf(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = vs.extractUrlBase(e);
			a = vs.resolveURL(t, this.path);
		} else a = vs.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new qo(this.manager);
		s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
			try {
				i.parse(n, a, function(n) {
					t(n), i.manager.itemEnd(e);
				}, o);
			} catch (e) {
				o(e);
			}
		}, n, o);
	}
	setDRACOLoader(e) {
		return this.dracoLoader = e, this;
	}
	setKTX2Loader(e) {
		return this.ktx2Loader = e, this;
	}
	setMeshoptDecoder(e) {
		return this.meshoptDecoder = e, this;
	}
	register(e) {
		return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
	}
	unregister(e) {
		return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
	}
	parse(e, t, n, r) {
		let i, a = {}, o = {}, s = new TextDecoder();
		if (typeof e == "string") i = JSON.parse(e);
		else if (e instanceof ArrayBuffer) {
			if (s.decode(new Uint8Array(e, 0, 4)) === uf) {
				try {
					a[Z.KHR_BINARY_GLTF] = new pf(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[Z.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new zf(i, {
			path: t || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		});
		c.fileLoader.setRequestHeader(this.requestHeader);
		for (let e = 0; e < this.pluginCallbacks.length; e++) {
			let t = this.pluginCallbacks[e](c);
			t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[t.name] = t, a[t.name] = !0;
		}
		if (i.extensionsUsed) for (let e = 0; e < i.extensionsUsed.length; ++e) {
			let t = i.extensionsUsed[e], n = i.extensionsRequired || [];
			switch (t) {
				case Z.KHR_MATERIALS_UNLIT:
					a[t] = new Kd();
					break;
				case Z.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new mf(i, this.dracoLoader);
					break;
				case Z.KHR_TEXTURE_TRANSFORM:
					a[t] = new hf();
					break;
				case Z.KHR_MESH_QUANTIZATION:
					a[t] = new gf();
					break;
				default: n.indexOf(t) >= 0 && o[t] === void 0 && console.warn("THREE.GLTFLoader: Unknown extension \"" + t + "\".");
			}
		}
		c.setExtensions(a), c.setPlugins(o), c.parse(n, r);
	}
	parseAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.parse(e, t, r, i);
		});
	}
};
function Ud() {
	let e = {};
	return {
		get: function(t) {
			return e[t];
		},
		add: function(t, n) {
			e[t] = n;
		},
		remove: function(t) {
			delete e[t];
		},
		removeAll: function() {
			e = {};
		}
	};
}
function Wd(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var Z = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
	KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
	KHR_MATERIALS_IOR: "KHR_materials_ior",
	KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
	KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
	KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
	KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
	KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
	KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
	KHR_MATERIALS_VOLUME: "KHR_materials_volume",
	KHR_TEXTURE_BASISU: "KHR_texture_basisu",
	KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
	KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
	KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
	EXT_MATERIALS_BUMP: "EXT_materials_bump",
	EXT_TEXTURE_WEBP: "EXT_texture_webp",
	EXT_TEXTURE_AVIF: "EXT_texture_avif",
	EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
	KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
	EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
}, Gd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_LIGHTS_PUNCTUAL, this.cache = {
			refs: {},
			uses: {}
		};
	}
	_markDefs() {
		let e = this.parser, t = this.parser.json.nodes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
		}
	}
	_loadLight(e) {
		let t = this.parser, n = "light:" + e, r = t.cache.get(n);
		if (r) return r;
		let i = t.json, a = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e], o, s = new J(16777215);
		a.color !== void 0 && s.setRGB(a.color[0], a.color[1], a.color[2], Ve);
		let c = a.range === void 0 ? 0 : a.range;
		switch (a.type) {
			case "directional":
				o = new _s(s), o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			case "point":
				o = new ms(s), o.distance = c;
				break;
			case "spot":
				o = new fs(s), o.distance = c, a.spot = a.spot || {}, a.spot.innerConeAngle = a.spot.innerConeAngle === void 0 ? 0 : a.spot.innerConeAngle, a.spot.outerConeAngle = a.spot.outerConeAngle === void 0 ? Math.PI / 4 : a.spot.outerConeAngle, o.angle = a.spot.outerConeAngle, o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle, o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
		}
		return o.position.set(0, 0, 0), jf(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), r = Promise.resolve(o), t.cache.add(n, r), r;
	}
	getDependency(e, t) {
		if (e === "light") return this._loadLight(t);
	}
	createNodeAttachment(e) {
		let t = this, n = this.parser, r = n.json.nodes[e], i = (r.extensions && r.extensions[this.name] || {}).light;
		return i === void 0 ? null : this._loadLight(i).then(function(e) {
			return n._getNodeRef(t.cache, i, e);
		});
	}
}, Kd = class {
	constructor() {
		this.name = Z.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return Ur;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new J(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], Ve), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, Be));
		}
		return Promise.all(r);
	}
}, qd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, Jd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new U(e, e);
		}
		return Promise.all(r);
	}
}, Yd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, Xd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, Zd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new J(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], Ve);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, Be)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, Qd = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, $d = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new J().setRGB(i[0], i[1], i[2], Ve), Promise.all(r);
	}
}, ef = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		return n === null || (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3)), Promise.resolve();
	}
}, tf = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new J().setRGB(i[0], i[1], i[2], Ve), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, Be)), Promise.all(r);
	}
}, nf = class {
	constructor(e) {
		this.parser = e, this.name = Z.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, rf = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return Wd(this.parser, e, this.name) === null ? null : fo;
	}
	extendMaterialParams(e, t) {
		let n = Wd(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, af = class {
	constructor(e) {
		this.parser = e, this.name = Z.KHR_TEXTURE_BASISU;
	}
	loadTexture(e) {
		let t = this.parser, n = t.json, r = n.textures[e];
		if (!r.extensions || !r.extensions[this.name]) return null;
		let i = r.extensions[this.name], a = t.options.ktx2Loader;
		if (!a) {
			if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
			return null;
		}
		return t.loadTextureImage(e, i.source, a);
	}
}, of = class {
	constructor(e) {
		this.parser = e, this.name = Z.EXT_TEXTURE_WEBP;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, sf = class {
	constructor(e) {
		this.parser = e, this.name = Z.EXT_TEXTURE_AVIF;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, cf = class {
	constructor(e, t) {
		this.name = t, this.parser = e;
	}
	loadBufferView(e) {
		let t = this.parser.json, n = t.bufferViews[e];
		if (n.extensions && n.extensions[this.name]) {
			let e = n.extensions[this.name], r = this.parser.getDependency("buffer", e.buffer), i = this.parser.options.meshoptDecoder;
			if (!i || !i.supported) {
				if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
				return null;
			}
			return r.then(function(t) {
				let n = e.byteOffset || 0, r = e.byteLength || 0, a = e.count, o = e.byteStride, s = new Uint8Array(t, n, r);
				return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, o, s, e.mode, e.filter).then(function(e) {
					return e.buffer;
				}) : i.ready.then(function() {
					let t = new ArrayBuffer(a * o);
					return i.decodeGltfBuffer(new Uint8Array(t), a, o, s, e.mode, e.filter), t;
				});
			});
		}
		return null;
	}
}, lf = class {
	constructor(e) {
		this.name = Z.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== bf.TRIANGLES && e.mode !== bf.TRIANGLE_STRIP && e.mode !== bf.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new q(), n = new W(), a = new At(), s = new W(1, 1, 1), c = new Di(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				let l = null;
				for (let e in o) if (e === "_COLOR_0") {
					let t = o[e];
					c.instanceColor = new yi(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (l === null) {
						let e = c.geometry;
						l = new Or(), l.name = e.name;
						for (let t in e.attributes) l.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) l.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && l.setIndex(e.index), l.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) l.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (l.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (l.boundingSphere = e.boundingSphere.clone()), l.drawRange.start = e.drawRange.start, l.drawRange.count = e.drawRange.count, l.userData = Object.assign({}, e.userData), c.geometry = l;
					}
					let t = o[e];
					l.setAttribute(e, new yi(t.array, t.itemSize, t.normalized));
				}
				Tn.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, uf = "glTF", df = 12, ff = {
	JSON: 1313821514,
	BIN: 5130562
}, pf = class {
	constructor(e) {
		this.name = Z.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, df), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== uf) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - df, i = new DataView(e, df), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === ff.JSON) {
				let r = new Uint8Array(e, df + a, t);
				this.content = n.decode(r);
			} else if (r === ff.BIN) {
				let n = df + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, mf = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = Z.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = Tf[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = Tf[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = xf[i.componentType].name, s[r] = i.normalized === !0;
			}
		}
		return t.getDependency("bufferView", i).then(function(e) {
			return new Promise(function(t, n) {
				r.decodeDracoFile(e, function(e) {
					for (let t in e.attributes) {
						let n = e.attributes[t], r = s[t];
						r !== void 0 && (n.normalized = r);
					}
					t(e);
				}, o, c, Ve, n);
			});
		});
	}
}, hf = class {
	constructor() {
		this.name = Z.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, gf = class {
	constructor() {
		this.name = Z.KHR_MESH_QUANTIZATION;
	}
}, _f = class extends xo {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r;
		for (let e = 0; e !== r; e++) t[e] = n[i + e];
		return t;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = o * 2, c = o * 3, l = r - t, u = (n - t) / l, d = u * u, f = d * u, p = e * c, m = p - c, h = -2 * f + 3 * d, g = f - d, _ = 1 - h, v = g - d + u;
		for (let e = 0; e !== o; e++) {
			let t = a[m + e + o], n = a[m + e + s] * l, r = a[p + e + o], c = a[p + e] * l;
			i[e] = _ * t + v * n + h * r + g * c;
		}
		return i;
	}
}, vf = new At(), yf = class extends _f {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return vf.fromArray(i).normalize().toArray(i), i;
	}
}, bf = {
	FLOAT: 5126,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
}, xf = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, Sf = {
	9728: o,
	9729: l,
	9984: s,
	9985: u,
	9986: c,
	9987: d
}, Cf = {
	33071: i,
	33648: a,
	10497: r
}, wf = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, Tf = {
	POSITION: "position",
	NORMAL: "normal",
	TANGENT: "tangent",
	TEXCOORD_0: "uv",
	TEXCOORD_1: "uv1",
	TEXCOORD_2: "uv2",
	TEXCOORD_3: "uv3",
	COLOR_0: "color",
	WEIGHTS_0: "skinWeight",
	JOINTS_0: "skinIndex"
}, Ef = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, Df = {
	CUBICSPLINE: void 0,
	LINEAR: Fe,
	STEP: Pe
}, Of = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function kf(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new uo({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: 0
	})), e.DefaultMaterial;
}
function Af(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function jf(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function Mf(e, t, n) {
	let r = !1, i = !1, a = !1;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = t[e];
		if (n.POSITION !== void 0 && (r = !0), n.NORMAL !== void 0 && (i = !0), n.COLOR_0 !== void 0 && (a = !0), r && i && a) break;
	}
	if (!r && !i && !a) return Promise.resolve(e);
	let o = [], s = [], c = [];
	for (let l = 0, u = t.length; l < u; l++) {
		let u = t[l];
		if (r) {
			let t = u.POSITION === void 0 ? e.attributes.position : n.getDependency("accessor", u.POSITION);
			o.push(t);
		}
		if (i) {
			let t = u.NORMAL === void 0 ? e.attributes.normal : n.getDependency("accessor", u.NORMAL);
			s.push(t);
		}
		if (a) {
			let t = u.COLOR_0 === void 0 ? e.attributes.color : n.getDependency("accessor", u.COLOR_0);
			c.push(t);
		}
	}
	return Promise.all([
		Promise.all(o),
		Promise.all(s),
		Promise.all(c)
	]).then(function(t) {
		let n = t[0], o = t[1], s = t[2];
		return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), a && (e.morphAttributes.color = s), e.morphTargetsRelative = !0, e;
	});
}
function Nf(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function Pf(e) {
	let t, n = e.extensions && e.extensions[Z.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + Ff(n.attributes) : e.indices + ":" + Ff(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + Ff(e.targets[n]);
	return t;
}
function Ff(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function If(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function Lf(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var Rf = new q(), zf = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Ud(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
			refs: {},
			uses: {}
		}, this.cameraCache = {
			refs: {},
			uses: {}
		}, this.lightCache = {
			refs: {},
			uses: {}
		}, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
		let n = !1, r = -1, i = !1, a = -1;
		if (typeof navigator < "u" && navigator.userAgent !== void 0) {
			let e = navigator.userAgent;
			n = /^((?!chrome|android).)*safari/i.test(e) === !0;
			let t = e.match(/Version\/(\d+)/);
			r = n && t ? parseInt(t[1], 10) : -1, i = e.indexOf("Firefox") > -1, a = i ? e.match(/Firefox\/([0-9]+)\./)[1] : -1;
		}
		this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new Xo(this.options.manager) : new bs(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new qo(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
	}
	setExtensions(e) {
		this.extensions = e;
	}
	setPlugins(e) {
		this.plugins = e;
	}
	parse(e, t) {
		let n = this, r = this.json, i = this.extensions;
		this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(e) {
			return e._markDefs && e._markDefs();
		}), Promise.all(this._invokeAll(function(e) {
			return e.beforeRoot && e.beforeRoot();
		})).then(function() {
			return Promise.all([
				n.getDependencies("scene"),
				n.getDependencies("animation"),
				n.getDependencies("camera")
			]);
		}).then(function(t) {
			let a = {
				scene: t[0][r.scene || 0],
				scenes: t[0],
				animations: t[1],
				cameras: t[2],
				asset: r.asset,
				parser: n,
				userData: {}
			};
			return Af(i, a, r), jf(a, r), Promise.all(n._invokeAll(function(e) {
				return e.afterRoot && e.afterRoot(a);
			})).then(function() {
				for (let e of a.scenes) e.updateMatrixWorld();
				e(a);
			});
		}).catch(t);
	}
	_markDefs() {
		let e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n].joints;
			for (let t = 0, n = r.length; t < n; t++) e[r[t]].isBone = !0;
		}
		for (let t = 0, r = e.length; t < r; t++) {
			let r = e[t];
			r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
		}
	}
	_addNodeRef(e, t) {
		t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
	}
	_getNodeRef(e, t, n) {
		if (e.refs[t] <= 1) return n;
		let r = n.clone(), i = (e, t) => {
			let n = this.associations.get(e);
			n != null && this.associations.set(t, n);
			for (let [n, r] of e.children.entries()) i(r, t.children[n]);
		};
		return i(n, r), r.name += "_instance_" + e.uses[t]++, r;
	}
	_invokeOne(e) {
		let t = Object.values(this.plugins);
		t.push(this);
		for (let n = 0; n < t.length; n++) {
			let r = e(t[n]);
			if (r) return r;
		}
		return null;
	}
	_invokeAll(e) {
		let t = Object.values(this.plugins);
		t.unshift(this);
		let n = [];
		for (let r = 0; r < t.length; r++) {
			let i = e(t[r]);
			i && n.push(i);
		}
		return n;
	}
	getDependency(e, t) {
		let n = e + ":" + t, r = this.cache.get(n);
		if (!r) {
			switch (e) {
				case "scene":
					r = this.loadScene(t);
					break;
				case "node":
					r = this._invokeOne(function(e) {
						return e.loadNode && e.loadNode(t);
					});
					break;
				case "mesh":
					r = this._invokeOne(function(e) {
						return e.loadMesh && e.loadMesh(t);
					});
					break;
				case "accessor":
					r = this.loadAccessor(t);
					break;
				case "bufferView":
					r = this._invokeOne(function(e) {
						return e.loadBufferView && e.loadBufferView(t);
					});
					break;
				case "buffer":
					r = this.loadBuffer(t);
					break;
				case "material":
					r = this._invokeOne(function(e) {
						return e.loadMaterial && e.loadMaterial(t);
					});
					break;
				case "texture":
					r = this._invokeOne(function(e) {
						return e.loadTexture && e.loadTexture(t);
					});
					break;
				case "skin":
					r = this.loadSkin(t);
					break;
				case "animation":
					r = this._invokeOne(function(e) {
						return e.loadAnimation && e.loadAnimation(t);
					});
					break;
				case "camera":
					r = this.loadCamera(t);
					break;
				default: if (r = this._invokeOne(function(n) {
					return n != this && n.getDependency && n.getDependency(e, t);
				}), !r) throw Error("Unknown type: " + e);
			}
			this.cache.add(n, r);
		}
		return r;
	}
	getDependencies(e) {
		let t = this.cache.get(e);
		if (!t) {
			let n = this, r = this.json[e + (e === "mesh" ? "es" : "s")] || [];
			t = Promise.all(r.map(function(t, r) {
				return n.getDependency(e, r);
			})), this.cache.add(e, t);
		}
		return t;
	}
	loadBuffer(e) {
		let t = this.json.buffers[e], n = this.fileLoader;
		if (t.type && t.type !== "arraybuffer") throw Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[Z.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(vs.resolveURL(t.uri, r.path), e, void 0, function() {
				i(/* @__PURE__ */ Error("THREE.GLTFLoader: Failed to load buffer \"" + t.uri + "\"."));
			});
		});
	}
	loadBufferView(e) {
		let t = this.json.bufferViews[e];
		return this.getDependency("buffer", t.buffer).then(function(e) {
			let n = t.byteLength || 0, r = t.byteOffset || 0;
			return e.slice(r, r + n);
		});
	}
	loadAccessor(e) {
		let t = this, n = this.json, r = this.json.accessors[e];
		if (r.bufferView === void 0 && r.sparse === void 0) {
			let e = wf[r.type], t = xf[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
			return Promise.resolve(new pr(i, e, n));
		}
		let i = [];
		return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
			let i = e[0], a = wf[r.type], o = xf[r.componentType], s = o.BYTES_PER_ELEMENT, c = s * a, l = r.byteOffset || 0, u = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, d = r.normalized === !0, f, p;
			if (u && u !== c) {
				let e = Math.floor(l / u), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, c = t.cache.get(n);
				c || (f = new o(i, e * u, r.count * u / s), c = new kr(f, u / s), t.cache.add(n, c)), p = new jr(c, a, l % u / s, d);
			} else f = i === null ? new o(r.count * a) : new o(i, l, r.count * a), p = new pr(f, a, d);
			if (r.sparse !== void 0) {
				let t = wf.SCALAR, n = xf[r.sparse.indices.componentType], s = r.sparse.indices.byteOffset || 0, c = r.sparse.values.byteOffset || 0, l = new n(e[1], s, r.sparse.count * t), u = new o(e[2], c, r.sparse.count * a);
				i !== null && (p = new pr(p.array.slice(), p.itemSize, p.normalized)), p.normalized = !1;
				for (let e = 0, t = l.length; e < t; e++) {
					let t = l[e];
					if (p.setX(t, u[e * a]), a >= 2 && p.setY(t, u[e * a + 1]), a >= 3 && p.setZ(t, u[e * a + 2]), a >= 4 && p.setW(t, u[e * a + 3]), a >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				p.normalized = d;
			}
			return p;
		});
	}
	loadTexture(e) {
		let t = this.json, n = this.options, r = t.textures[e].source, i = t.images[r], a = this.textureLoader;
		if (i.uri) {
			let e = n.manager.getHandler(i.uri);
			e !== null && (a = e);
		}
		return this.loadTextureImage(e, r, a);
	}
	loadTextureImage(e, t, n) {
		let r = this, i = this.json, a = i.textures[e], o = i.images[t], s = (o.uri || o.bufferView) + ":" + a.sampler;
		if (this.textureCache[s]) return this.textureCache[s];
		let c = this.loadImageSource(t, n).then(function(t) {
			t.flipY = !1, t.name = a.name || o.name || "", t.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (t.name = o.uri);
			let n = (i.samplers || {})[a.sampler] || {};
			return t.magFilter = Sf[n.magFilter] || 1006, t.minFilter = Sf[n.minFilter] || 1008, t.wrapS = Cf[n.wrapS] || 1e3, t.wrapT = Cf[n.wrapT] || 1e3, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== 1003 && t.minFilter !== 1006, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let n = this, r = this.json, i = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1;
		if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
			c = !0;
			let t = new Blob([e], { type: a.mimeType });
			return s = o.createObjectURL(t), s;
		});
		else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
		let l = Promise.resolve(s).then(function(e) {
			return new Promise(function(n, r) {
				let a = n;
				t.isImageBitmapLoader === !0 && (a = function(e) {
					let t = new Kt(e);
					t.needsUpdate = !0, n(t);
				}), t.load(vs.resolveURL(e, i.path), a, void 0, r);
			});
		}).then(function(e) {
			return c === !0 && o.revokeObjectURL(s), jf(e, a), e.userData.mimeType = a.mimeType || Lf(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = l, l;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[Z.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[Z.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[Z.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new pa(), Lr.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new $i(), Lr.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
		}
		if (r || i || a) {
			let e = "ClonedMaterial:" + n.uuid + ":";
			r && (e += "derivative-tangents:"), i && (e += "vertex-colors:"), a && (e += "flat-shading:");
			let t = this.cache.get(e);
			t || (t = n.clone(), i && (t.vertexColors = !0), a && (t.flatShading = !0), r && (t.normalScale && (t.normalScale.y *= -1), t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)), this.cache.add(e, t), this.associations.set(t, this.associations.get(n))), n = t;
		}
		e.material = n;
	}
	getMaterialType() {
		return uo;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
		if (s[Z.KHR_MATERIALS_UNLIT]) {
			let e = r[Z.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (o.color = new J(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				o.color.setRGB(e[0], e[1], e[2], Ve), o.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, Be)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), c.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, o);
			})));
		}
		i.doubleSided === !0 && (o.side = 2);
		let l = i.alphaMode || Of.OPAQUE;
		if (l === Of.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === Of.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== Ur && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new U(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			o.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== Ur && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== Ur) {
			let e = i.emissiveFactor;
			o.emissive = new J().setRGB(e[0], e[1], e[2], Ve);
		}
		return i.emissiveTexture !== void 0 && a !== Ur && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, Be)), Promise.all(c).then(function() {
			let n = new a(o);
			return i.name && (n.name = i.name), jf(n, i), t.associations.set(n, { materials: e }), i.extensions && Af(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = Is.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[Z.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return Vf(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = Pf(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[Z.KHR_DRACO_MESH_COMPRESSION] ? i(o) : Vf(new Or(), o, t), o.mode === bf.TRIANGLE_STRIP ? e = e.then((e) => zd(e, 1)) : o.mode === bf.TRIANGLE_FAN && (e = e.then((e) => zd(e, 2))), r[s] = {
					primitive: o,
					promise: e
				}, a.push(e);
			}
		}
		return Promise.all(a);
	}
	loadMesh(e) {
		let t = this, n = this.json, r = this.extensions, i = n.meshes[e], a = i.primitives, o = [];
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e].material === void 0 ? kf(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === bf.TRIANGLES || u.mode === bf.TRIANGLE_STRIP || u.mode === bf.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new pi(l, f) : new ti(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === bf.LINES) d = new da(l, f);
				else if (u.mode === bf.LINE_STRIP) d = new sa(l, f);
				else if (u.mode === bf.LINE_LOOP) d = new fa(l, f);
				else if (u.mode === bf.POINTS) d = new va(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && Nf(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), jf(d, i), u.extensions && Af(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && Af(r, c[0], i), c[0];
			let l = new En();
			i.extensions && Af(r, l, i), t.associations.set(l, { meshes: e });
			for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
			return l;
		});
	}
	loadCamera(e) {
		let t, n = this.json.cameras[e], r = n[n.type];
		if (!r) console.warn("THREE.GLTFLoader: Missing camera parameters.");
		else return n.type === "perspective" ? t = new us(kt.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new hs(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), jf(t, n), Promise.resolve(t);
	}
	loadSkin(e) {
		let t = this.json.skins[e], n = [];
		for (let e = 0, r = t.joints.length; e < r; e++) n.push(this._loadNodeShallow(t.joints[e]));
		return t.inverseBindMatrices === void 0 ? n.push(null) : n.push(this.getDependency("accessor", t.inverseBindMatrices)), Promise.all(n).then(function(e) {
			let n = e.pop(), r = e, i = [], a = [];
			for (let e = 0, o = r.length; e < o; e++) {
				let o = r[e];
				if (o) {
					i.push(o);
					let t = new q();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new vi(i, a);
		});
	}
	loadAnimation(e) {
		let t = this.json, n = this, r = t.animations[e], i = r.name ? r.name : "animation_" + e, a = [], o = [], s = [], c = [], l = [];
		for (let e = 0, t = r.channels.length; e < t; e++) {
			let t = r.channels[e], n = r.samplers[t.sampler], i = t.target, u = i.node, d = r.parameters === void 0 ? n.input : r.parameters[n.input], f = r.parameters === void 0 ? n.output : r.parameters[n.output];
			i.node !== void 0 && (a.push(this.getDependency("node", u)), o.push(this.getDependency("accessor", d)), s.push(this.getDependency("accessor", f)), c.push(n), l.push(i));
		}
		return Promise.all([
			Promise.all(a),
			Promise.all(o),
			Promise.all(s),
			Promise.all(c),
			Promise.all(l)
		]).then(function(e) {
			let t = e[0], a = e[1], o = e[2], s = e[3], c = e[4], l = [];
			for (let e = 0, r = t.length; e < r; e++) {
				let r = t[e], i = a[e], u = o[e], d = s[e], f = c[e];
				if (r === void 0) continue;
				r.updateMatrix && r.updateMatrix();
				let p = n._createAnimationTracks(r, i, u, d, f);
				if (p) for (let e = 0; e < p.length; e++) l.push(p[e]);
			}
			let u = new Ro(i, void 0, l);
			return jf(u, r), u;
		});
	}
	createNodeMesh(e) {
		let t = this.json, n = this, r = t.nodes[e];
		return r.mesh === void 0 ? null : n.getDependency("mesh", r.mesh).then(function(e) {
			let t = n._getNodeRef(n.meshCache, r.mesh, e);
			return r.weights !== void 0 && t.traverse(function(e) {
				if (e.isMesh) for (let t = 0, n = r.weights.length; t < n; t++) e.morphTargetInfluences[t] = r.weights[t];
			}), t;
		});
	}
	loadNode(e) {
		let t = this.json, n = this, r = t.nodes[e], i = n._loadNodeShallow(e), a = [], o = r.children || [];
		for (let e = 0, t = o.length; e < t; e++) a.push(n.getDependency("node", o[e]));
		let s = r.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", r.skin);
		return Promise.all([
			i,
			Promise.all(a),
			s
		]).then(function(e) {
			let t = e[0], n = e[1], r = e[2];
			r !== null && t.traverse(function(e) {
				e.isSkinnedMesh && e.bind(r, Rf);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new W().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
			}
			return t;
		});
	}
	_loadNodeShallow(e) {
		let t = this.json, n = this.extensions, r = this;
		if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
		let i = t.nodes[e], a = i.name ? r.createUniqueName(i.name) : "", o = [], s = r._invokeOne(function(t) {
			return t.createNodeMesh && t.createNodeMesh(e);
		});
		return s && o.push(s), i.camera !== void 0 && o.push(r.getDependency("camera", i.camera).then(function(e) {
			return r._getNodeRef(r.cameraCache, i.camera, e);
		})), r._invokeAll(function(t) {
			return t.createNodeAttachment && t.createNodeAttachment(e);
		}).forEach(function(e) {
			o.push(e);
		}), this.nodeCache[e] = Promise.all(o).then(function(t) {
			let o;
			if (o = i.isBone === !0 ? new mi() : t.length > 1 ? new En() : t.length === 1 ? t[0] : new Tn(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
			if (i.name && (o.userData.name = i.name, o.name = a), jf(o, i), i.extensions && Af(n, o, i), i.matrix !== void 0) {
				let e = new q();
				e.fromArray(i.matrix), o.applyMatrix4(e);
			} else i.translation !== void 0 && o.position.fromArray(i.translation), i.rotation !== void 0 && o.quaternion.fromArray(i.rotation), i.scale !== void 0 && o.scale.fromArray(i.scale);
			if (!r.associations.has(o)) r.associations.set(o, {});
			else if (i.mesh !== void 0 && r.meshCache.refs[i.mesh] > 1) {
				let e = r.associations.get(o);
				r.associations.set(o, { ...e });
			}
			return r.associations.get(o).nodes = e, o;
		}), this.nodeCache[e];
	}
	loadScene(e) {
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new En();
		n.name && (i.name = r.createUniqueName(n.name)), jf(i, n), n.extensions && Af(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(Bd(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof Lr || e instanceof Kt) && t.set(e, n);
				return e.traverse((e) => {
					let n = r.associations.get(e);
					n != null && t.set(e, n);
				}), t;
			})(i), i;
		});
	}
	_createAnimationTracks(e, t, n, r, i) {
		let a = [], o = e.name ? e.name : e.uuid, s = [];
		function c(e) {
			e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
		}
		Ef[i.path] === Ef.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (Ef[i.path]) {
			case Ef.weights:
				l = No;
				break;
			case Ef.rotation:
				l = Fo;
				break;
			case Ef.translation:
			case Ef.scale:
				l = Lo;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = No;
					break;
				default: l = Lo;
			}
		}
		let u = r.interpolation === void 0 ? Fe : Df[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + Ef[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = If(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof Fo ? yf : _f)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function Bf(e, t, n) {
	let r = t.attributes, i = new Yn();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new W(t[0], t[1], t[2]), new W(a[0], a[1], a[2])), e.normalized) {
				let t = If(xf[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new W(), t = new W();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = If(xf[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new br();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function Vf(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Tf[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return K.workingColorSpace !== "srgb-linear" && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${K.workingColorSpace}" not supported.`), jf(e, t), Bf(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : Mf(e, t.targets, n);
	});
}
// node_modules/three/examples/jsm/environments/RoomEnvironment.js
var Hf = class extends Pn {
	constructor() {
		super(), this.name = "RoomEnvironment", this.position.y = -3.5;
		let e = new wa();
		e.deleteAttribute("uv");
		let t = new uo({ side: 1 }), n = new uo(), r = new ms(16777215, 900, 28, 2);
		r.position.set(.418, 16.199, .3), this.add(r);
		let i = new ti(e, t);
		i.position.set(-.757, 13.219, .717), i.scale.set(31.713, 28.305, 28.591), this.add(i);
		let a = new Di(e, n, 6), o = new Tn();
		o.position.set(-10.906, 2.009, 1.846), o.rotation.set(0, -.195, 0), o.scale.set(2.328, 7.905, 4.651), o.updateMatrix(), a.setMatrixAt(0, o.matrix), o.position.set(-5.607, -.754, -.758), o.rotation.set(0, .994, 0), o.scale.set(1.97, 1.534, 3.955), o.updateMatrix(), a.setMatrixAt(1, o.matrix), o.position.set(6.167, .857, 7.803), o.rotation.set(0, .561, 0), o.scale.set(3.927, 6.285, 3.687), o.updateMatrix(), a.setMatrixAt(2, o.matrix), o.position.set(-2.017, .018, 6.124), o.rotation.set(0, .333, 0), o.scale.set(2.002, 4.566, 2.064), o.updateMatrix(), a.setMatrixAt(3, o.matrix), o.position.set(2.291, -.756, -2.621), o.rotation.set(0, -.286, 0), o.scale.set(1.546, 1.552, 1.496), o.updateMatrix(), a.setMatrixAt(4, o.matrix), o.position.set(-2.193, -.369, -5.547), o.rotation.set(0, .516, 0), o.scale.set(3.875, 3.487, 2.986), o.updateMatrix(), a.setMatrixAt(5, o.matrix), this.add(a);
		let s = new ti(e, Uf(50));
		s.position.set(-16.116, 14.37, 8.208), s.scale.set(.1, 2.428, 2.739), this.add(s);
		let c = new ti(e, Uf(50));
		c.position.set(-16.109, 18.021, -8.207), c.scale.set(.1, 2.425, 2.751), this.add(c);
		let l = new ti(e, Uf(17));
		l.position.set(14.904, 12.198, -1.832), l.scale.set(.15, 4.265, 6.331), this.add(l);
		let u = new ti(e, Uf(43));
		u.position.set(-.462, 8.89, 14.52), u.scale.set(4.38, 5.441, .088), this.add(u);
		let d = new ti(e, Uf(20));
		d.position.set(3.235, 11.486, -12.541), d.scale.set(2.5, 2, .1), this.add(d);
		let f = new ti(e, Uf(100));
		f.position.set(0, 20, 0), f.scale.set(1, .1, 1), this.add(f);
	}
	dispose() {
		let e = /* @__PURE__ */ new Set();
		this.traverse((t) => {
			t.isMesh && (e.add(t.geometry), e.add(t.material));
		});
		for (let t of e) t.dispose();
	}
};
function Uf(e) {
	return new po({
		color: 0,
		emissive: 16777215,
		emissiveIntensity: e
	});
}
var Wf = 1.25, Gf = 65535, Kf = 2 ** -24, qf = Symbol("SKIP_GENERATION"), Jf = {
	strategy: 0,
	maxDepth: 40,
	targetLeafSize: 10,
	useSharedArrayBuffer: !1,
	setBoundingBox: !0,
	onProgress: null,
	indirect: !1,
	verbose: !0,
	range: null,
	[qf]: !1
};
// node_modules/three-mesh-bvh/src/utils/ArrayBoxUtilities.js
function Yf(e, t, n) {
	return n.min.x = t[e], n.min.y = t[e + 1], n.min.z = t[e + 2], n.max.x = t[e + 3], n.max.y = t[e + 4], n.max.z = t[e + 5], n;
}
function Xf(e) {
	let t = -1, n = -Infinity;
	for (let r = 0; r < 3; r++) {
		let i = e[r + 3] - e[r];
		i > n && (n = i, t = r);
	}
	return t;
}
function Zf(e, t) {
	t.set(e);
}
function Qf(e, t, n) {
	let r, i;
	for (let a = 0; a < 3; a++) {
		let o = a + 3;
		r = e[a], i = t[a], n[a] = r < i ? r : i, r = e[o], i = t[o], n[o] = r > i ? r : i;
	}
}
function $f(e, t, n) {
	for (let r = 0; r < 3; r++) {
		let i = t[e + 2 * r], a = t[e + 2 * r + 1], o = i - a, s = i + a;
		o < n[r] && (n[r] = o), s > n[r + 3] && (n[r + 3] = s);
	}
}
function ep(e) {
	let t = e[3] - e[0], n = e[4] - e[1], r = e[5] - e[2];
	return 2 * (t * n + n * r + r * t);
}
// node_modules/three-mesh-bvh/src/core/utils/nodeBufferUtils.js
function tp(e, t) {
	return t[e + 15] === Gf;
}
function np(e, t) {
	return t[e + 6];
}
function rp(e, t) {
	return t[e + 14];
}
function ip(e) {
	return e + 8;
}
function ap(e, t) {
	return e + t[e + 6] * 8;
}
function op(e, t) {
	return t[e + 7];
}
function sp(e) {
	return e;
}
// node_modules/three-mesh-bvh/src/core/build/computeBoundsUtils.js
function cp(e, t, n, r, i) {
	let a = Infinity, o = Infinity, s = Infinity, c = -Infinity, l = -Infinity, u = -Infinity, d = Infinity, f = Infinity, p = Infinity, m = -Infinity, h = -Infinity, g = -Infinity, _ = e.offset || 0;
	for (let r = (t - _) * 6, i = (t + n - _) * 6; r < i; r += 6) {
		let t = e[r + 0], n = e[r + 1], i = t - n, _ = t + n;
		i < a && (a = i), _ > c && (c = _), t < d && (d = t), t > m && (m = t);
		let v = e[r + 2], y = e[r + 3], b = v - y, x = v + y;
		b < o && (o = b), x > l && (l = x), v < f && (f = v), v > h && (h = v);
		let S = e[r + 4], C = e[r + 5], w = S - C, T = S + C;
		w < s && (s = w), T > u && (u = T), S < p && (p = S), S > g && (g = S);
	}
	r[0] = a, r[1] = o, r[2] = s, r[3] = c, r[4] = l, r[5] = u, i[0] = d, i[1] = f, i[2] = p, i[3] = m, i[4] = h, i[5] = g;
}
// node_modules/three-mesh-bvh/src/core/build/splitUtils.js
var lp = 32, up = (e, t) => e.candidate - t.candidate, dp = /* @__PURE__ */ Array(lp).fill().map(() => ({
	count: 0,
	bounds: /* @__PURE__ */ new Float32Array(6),
	rightCacheBounds: /* @__PURE__ */ new Float32Array(6),
	leftCacheBounds: /* @__PURE__ */ new Float32Array(6),
	candidate: 0
})), fp = /* @__PURE__ */ new Float32Array(6);
function pp(e, t, n, r, i, a) {
	let o = -1, s = 0;
	if (a === 0) o = Xf(t), o !== -1 && (s = (t[o] + t[o + 3]) / 2);
	else if (a === 1) o = Xf(e), o !== -1 && (s = mp(n, r, i, o));
	else if (a === 2) {
		let a = ep(e), c = Wf * i, l = n.offset || 0, u = (r - l) * 6, d = (r + i - l) * 6;
		for (let e = 0; e < 3; e++) {
			let r = t[e], l = (t[e + 3] - r) / lp;
			if (i < lp / 4) {
				let t = [...dp];
				t.length = i;
				let r = 0;
				for (let i = u; i < d; i += 6, r++) {
					let a = t[r];
					a.candidate = n[i + 2 * e], a.count = 0;
					let { bounds: o, leftCacheBounds: s, rightCacheBounds: c } = a;
					for (let e = 0; e < 3; e++) c[e] = Infinity, c[e + 3] = -Infinity, s[e] = Infinity, s[e + 3] = -Infinity, o[e] = Infinity, o[e + 3] = -Infinity;
					$f(i, n, o);
				}
				t.sort(up);
				let l = i;
				for (let e = 0; e < l; e++) {
					let n = t[e];
					for (; e + 1 < l && t[e + 1].candidate === n.candidate;) t.splice(e + 1, 1), l--;
				}
				for (let r = u; r < d; r += 6) {
					let i = n[r + 2 * e];
					for (let e = 0; e < l; e++) {
						let a = t[e];
						i >= a.candidate ? $f(r, n, a.rightCacheBounds) : ($f(r, n, a.leftCacheBounds), a.count++);
					}
				}
				for (let n = 0; n < l; n++) {
					let r = t[n], l = r.count, u = i - r.count, d = r.leftCacheBounds, f = r.rightCacheBounds, p = 0;
					l !== 0 && (p = ep(d) / a);
					let m = 0;
					u !== 0 && (m = ep(f) / a);
					let h = 1 + Wf * (p * l + m * u);
					h < c && (o = e, c = h, s = r.candidate);
				}
			} else {
				for (let e = 0; e < lp; e++) {
					let t = dp[e];
					t.count = 0, t.candidate = r + l + e * l;
					let n = t.bounds;
					for (let e = 0; e < 3; e++) n[e] = Infinity, n[e + 3] = -Infinity;
				}
				for (let t = u; t < d; t += 6) {
					let i = ~~((n[t + 2 * e] - r) / l);
					i >= lp && (i = 31);
					let a = dp[i];
					a.count++, $f(t, n, a.bounds);
				}
				let t = dp[31];
				Zf(t.bounds, t.rightCacheBounds);
				for (let e = 30; e >= 0; e--) {
					let t = dp[e], n = dp[e + 1];
					Qf(t.bounds, n.rightCacheBounds, t.rightCacheBounds);
				}
				let f = 0;
				for (let t = 0; t < 31; t++) {
					let n = dp[t], r = n.count, l = n.bounds, u = dp[t + 1].rightCacheBounds;
					r !== 0 && (f === 0 ? Zf(l, fp) : Qf(l, fp, fp)), f += r;
					let d = 0, p = 0;
					f !== 0 && (d = ep(fp) / a);
					let m = i - f;
					m !== 0 && (p = ep(u) / a);
					let h = 1 + Wf * (d * f + p * m);
					h < c && (o = e, c = h, s = n.candidate);
				}
			}
		}
	} else console.warn(`BVH: Invalid build strategy value ${a} used.`);
	return {
		axis: o,
		pos: s
	};
}
function mp(e, t, n, r) {
	let i = 0, a = e.offset;
	for (let o = t, s = t + n; o < s; o++) i += e[(o - a) * 6 + r * 2];
	return i / n;
}
// node_modules/three-mesh-bvh/src/core/BVHNode.js
var hp = class {
	constructor() {
		this.boundingData = /* @__PURE__ */ new Float32Array(6);
	}
};
// node_modules/three-mesh-bvh/src/core/build/sortUtils.js
function gp(e, t, n, r, i, a) {
	let o = r, s = r + i - 1, c = a.pos, l = a.axis * 2, u = n.offset || 0;
	for (;;) {
		for (; o <= s && n[(o - u) * 6 + l] < c;) o++;
		for (; o <= s && n[(s - u) * 6 + l] >= c;) s--;
		if (o < s) {
			for (let n = 0; n < t; n++) {
				let r = e[o * t + n];
				e[o * t + n] = e[s * t + n], e[s * t + n] = r;
			}
			for (let e = 0; e < 6; e++) {
				let t = o - u, r = s - u, i = n[t * 6 + e];
				n[t * 6 + e] = n[r * 6 + e], n[r * 6 + e] = i;
			}
			o++, s--;
		} else return o;
	}
}
// node_modules/three-mesh-bvh/src/core/build/buildUtils.js
var _p, vp, yp, bp, xp = 2 ** 32;
function Sp(e) {
	return "count" in e ? 1 : 1 + Sp(e.left) + Sp(e.right);
}
function Cp(e, t, n) {
	return _p = new Float32Array(n), vp = new Uint32Array(n), yp = new Uint16Array(n), bp = new Uint8Array(n), wp(e, t);
}
function wp(e, t) {
	let n = e / 4, r = e / 2, i = "count" in t, a = t.boundingData;
	for (let e = 0; e < 6; e++) _p[n + e] = a[e];
	if (i) return t.buffer ? (bp.set(new Uint8Array(t.buffer), e), e + t.buffer.byteLength) : (vp[n + 6] = t.offset, yp[r + 14] = t.count, yp[r + 15] = Gf, e + 32);
	{
		let { left: r, right: i, splitAxis: a } = t, o = wp(e + 32, r), s = e / 32, c = o / 32 - s;
		if (c > xp) throw Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");
		return vp[n + 6] = c, vp[n + 7] = a, wp(o, i);
	}
}
// node_modules/three-mesh-bvh/src/core/build/buildTree.js
function Tp(e, t, n, r, i, a) {
	let { maxDepth: o, verbose: s, targetLeafSize: c, _strictLeafSize: l = Infinity, strategy: u, onProgress: d } = i, f = e.primitiveBuffer, p = e.primitiveBufferStride, m = /* @__PURE__ */ new Float32Array(6), h = !1, g = new hp();
	return cp(t, n, r, g.boundingData, m), v(g, n, r, m), g;
	function _(e) {
		d && d((e - a.offset) / a.count);
	}
	function v(e, n, r, i = null, a = 0) {
		!h && a >= o && (h = !0, s && console.warn(`BVH: Max depth of ${o} reached when generating BVH. Consider increasing maxDepth.`));
		let d = r > l;
		if (r <= c && !d || a >= o) return _(n + r), e.offset = n, e.count = r, e;
		let g = pp(e.boundingData, i, t, n, r, u), y = g.axis === -1 ? -1 : gp(f, p, t, n, r, g);
		if (g.axis === -1 || y === n || y === n + r) {
			if (!d) return _(n + r), e.offset = n, e.count = r, e;
			g.axis = Math.max(0, Xf(e.boundingData)), y = n + Math.max(1, Math.floor(r / 2));
		}
		e.splitAxis = g.axis;
		let b = new hp(), x = n, S = y - n;
		e.left = b, cp(t, x, S, b.boundingData, m), v(b, x, S, m, a + 1);
		let C = new hp(), w = y, T = r - S;
		return e.right = C, cp(t, w, T, C.boundingData, m), v(C, w, T, m, a + 1), e;
	}
}
function Ep(e, t) {
	let n = t.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer, r = e.getRootRanges(t.range), i = r[0], a = r[r.length - 1], o = {
		offset: i.offset,
		count: a.offset + a.count - i.offset
	}, s = new Float32Array(6 * o.count);
	s.offset = o.offset, e.computePrimitiveBounds(o.offset, o.count, s), e._roots = r.map((r) => {
		let i = Tp(e, s, r.offset, r.count, t, o), a = Sp(i), c = new n(32 * a);
		return Cp(0, i, c), c;
	});
}
// node_modules/three-mesh-bvh/src/utils/PrimitivePool.js
var Dp = class {
	constructor(e) {
		this._getNewPrimitive = e, this._primitives = [];
	}
	getPrimitive() {
		let e = this._primitives;
		return e.length === 0 ? this._getNewPrimitive() : e.pop();
	}
	releasePrimitive(e) {
		this._primitives.push(e);
	}
}, Op = /* @__PURE__ */ new class {
	constructor() {
		this.float32Array = null, this.uint16Array = null, this.uint32Array = null;
		let e = [], t = null;
		this.setBuffer = (n) => {
			t && e.push(t), t = n, this.float32Array = new Float32Array(n), this.uint16Array = new Uint16Array(n), this.uint32Array = new Uint32Array(n);
		}, this.clearBuffer = () => {
			t = null, this.float32Array = null, this.uint16Array = null, this.uint32Array = null, e.length !== 0 && this.setBuffer(e.pop());
		};
	}
}(), kp, Ap, jp = [], Mp = /* @__PURE__ */ new Dp(() => new Yn());
function Np(e, t, n, r, i, a) {
	kp = Mp.getPrimitive(), Ap = Mp.getPrimitive(), jp.push(kp, Ap), Op.setBuffer(e._roots[t]);
	let o = Pp(0, e.geometry, n, r, i, a);
	Op.clearBuffer(), Mp.releasePrimitive(kp), Mp.releasePrimitive(Ap), jp.pop(), jp.pop();
	let s = jp.length;
	return s > 0 && (Ap = jp[s - 1], kp = jp[s - 2]), o;
}
function Pp(e, t, n, r, i = null, a = 0, o = 0) {
	let { float32Array: s, uint16Array: c, uint32Array: l } = Op, u = e * 2;
	if (tp(u, c)) {
		let t = np(e, l), n = rp(u, c);
		return Yf(sp(e), s, kp), r(t, n, !1, o, a + e / 8, kp);
	}
	{
		let u = ip(e), d = ap(e, l), f = u, p = d, m, h, g, _;
		if (i && (g = kp, _ = Ap, Yf(sp(f), s, g), Yf(sp(p), s, _), m = i(g), h = i(_), h < m)) {
			f = d, p = u;
			let e = m;
			m = h, h = e, g = _;
		}
		g || (g = kp, Yf(sp(f), s, g));
		let v = tp(f * 2, c), y = n(g, v, m, o + 1, a + f / 8), b;
		if (y === 2) {
			let e = w(f);
			b = r(e, T(f) - e, !0, o + 1, a + f / 8, g);
		} else b = y && Pp(f, t, n, r, i, a, o + 1);
		if (b) return !0;
		_ = Ap, Yf(sp(p), s, _);
		let x = tp(p * 2, c), S = n(_, x, h, o + 1, a + p / 8), C;
		if (S === 2) {
			let e = w(p);
			C = r(e, T(p) - e, !0, o + 1, a + p / 8, _);
		} else C = S && Pp(p, t, n, r, i, a, o + 1);
		return !!C;
		function w(e) {
			let { uint16Array: t, uint32Array: n } = Op, r = e * 2;
			for (; !tp(r, t);) e = ip(e), r = e * 2;
			return np(e, n);
		}
		function T(e) {
			let { uint16Array: t, uint32Array: n } = Op, r = e * 2;
			for (; !tp(r, t);) e = ap(e, n), r = e * 2;
			return np(e, n) + rp(r, t);
		}
	}
}
// node_modules/three-mesh-bvh/src/core/cast/bvhcast.js
var Fp = /* @__PURE__ */ new Op.constructor(), Ip = /* @__PURE__ */ new Op.constructor(), Lp = /* @__PURE__ */ new Dp(() => new Yn()), Rp = /* @__PURE__ */ new Yn(), zp = /* @__PURE__ */ new Yn(), Bp = /* @__PURE__ */ new Yn(), Vp = /* @__PURE__ */ new Yn(), Hp = !1;
function Up(e, t, n, r) {
	if (Hp) throw Error("MeshBVH: Recursive calls to bvhcast not supported.");
	Hp = !0;
	let i = e._roots, a = t._roots, o, s = 0, c = 0, l = new q().copy(n).invert();
	for (let e = 0, t = i.length; e < t; e++) {
		Fp.setBuffer(i[e]), c = 0;
		let t = Lp.getPrimitive();
		Yf(sp(0), Fp.float32Array, t), t.applyMatrix4(l);
		for (let e = 0, i = a.length; e < i && (Ip.setBuffer(a[e]), o = Wp(0, 0, n, l, r, s, c, 0, 0, t), Ip.clearBuffer(), c += a[e].byteLength / 32, !o); e++);
		if (Lp.releasePrimitive(t), Fp.clearBuffer(), s += i[e].byteLength / 32, o) break;
	}
	return Hp = !1, o;
}
function Wp(e, t, n, r, i, a = 0, o = 0, s = 0, c = 0, l = null, u = !1) {
	let d, f;
	u ? (d = Ip, f = Fp) : (d = Fp, f = Ip);
	let p = d.float32Array, m = d.uint32Array, h = d.uint16Array, g = f.float32Array, _ = f.uint32Array, v = f.uint16Array, y = e * 2, b = t * 2, x = tp(y, h), S = tp(b, v), C = !1;
	if (S && x) C = u ? i(np(t, _), rp(t * 2, v), np(e, m), rp(e * 2, h), c, o + t / 8, s, a + e / 8) : i(np(e, m), rp(e * 2, h), np(t, _), rp(t * 2, v), s, a + e / 8, c, o + t / 8);
	else if (S) {
		let l = Lp.getPrimitive();
		Yf(sp(t), g, l), l.applyMatrix4(n);
		let d = ip(e), f = ap(e, m);
		Yf(sp(d), p, Rp), Yf(sp(f), p, zp);
		let h = l.intersectsBox(Rp), _ = l.intersectsBox(zp);
		C = h && Wp(t, d, r, n, i, o, a, c, s + 1, l, !u) || _ && Wp(t, f, r, n, i, o, a, c, s + 1, l, !u), Lp.releasePrimitive(l);
	} else {
		let d = ip(t), f = ap(t, _);
		Yf(sp(d), g, Bp), Yf(sp(f), g, Vp);
		let h = l.intersectsBox(Bp), v = l.intersectsBox(Vp);
		if (h && v) C = Wp(e, d, n, r, i, a, o, s, c + 1, l, u) || Wp(e, f, n, r, i, a, o, s, c + 1, l, u);
		else if (h) {
			if (x) C = Wp(e, d, n, r, i, a, o, s, c + 1, l, u);
			else {
				let t = Lp.getPrimitive();
				t.copy(Bp).applyMatrix4(n);
				let l = ip(e), f = ap(e, m);
				Yf(sp(l), p, Rp), Yf(sp(f), p, zp);
				let h = t.intersectsBox(Rp), g = t.intersectsBox(zp);
				C = h && Wp(d, l, r, n, i, o, a, c, s + 1, t, !u) || g && Wp(d, f, r, n, i, o, a, c, s + 1, t, !u), Lp.releasePrimitive(t);
			}
		} else if (v) {
			if (x) C = Wp(e, f, n, r, i, a, o, s, c + 1, l, u);
			else {
				let t = Lp.getPrimitive();
				t.copy(Vp).applyMatrix4(n);
				let l = ip(e), d = ap(e, m);
				Yf(sp(l), p, Rp), Yf(sp(d), p, zp);
				let h = t.intersectsBox(Rp), g = t.intersectsBox(zp);
				C = h && Wp(f, l, r, n, i, o, a, c, s + 1, t, !u) || g && Wp(f, d, r, n, i, o, a, c, s + 1, t, !u), Lp.releasePrimitive(t);
			}
		}
	}
	return C;
}
// node_modules/three-mesh-bvh/src/core/BVHTraversalHelper.js
var Gp = new class {
	constructor() {
		let e = null, t = null, n = null, r = !1;
		this.root = null, this.buffer = null, this.uint32Array = null, this.uint16Array = null, this.setBVH = (i, a) => {
			if (r) throw Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");
			this.root = a, this.buffer = e = i._roots[a], this.uint16Array = n = new Uint16Array(e), this.uint32Array = t = new Uint32Array(e);
		}, this.reset = () => {
			this.root = null, this.buffer = e = null, this.uint16Array = n = null, this.uint32Array = t = null;
		}, this.getRangeStart = (e) => {
			let r = e * 2;
			for (; !tp(r, n);) e = ip(e), r = e * 2;
			return np(e, t);
		}, this.getRangeEnd = (e) => {
			let r = e * 2;
			for (; !tp(r, n);) e = ap(e, t), r = e * 2;
			return np(e, t) + rp(r, n);
		};
		let i = (e, r, a) => {
			let o = tp(r * 2, n);
			if (!e(a, o, r) && !o) {
				let n = ip(r), o = ap(r, t);
				i(e, n, a + 1), i(e, o, a + 1);
			}
		};
		this.traverseBuffer = (e) => {
			if (r) throw Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");
			r = !0;
			try {
				i(e, 0, 0);
			} finally {
				r = !1;
			}
		}, this.traverse = (r) => {
			this.traverseBuffer((i, a, o) => {
				if (a) {
					let s = o * 2, c = t[o + 6], l = n[s + 14];
					return r(i, a, new Float32Array(e, o * 4, 6), c, l);
				}
				{
					let n = op(o, t);
					return r(i, a, new Float32Array(e, o * 4, 6), n);
				}
			});
		};
	}
}(), Kp = /* @__PURE__ */ new Yn(), qp = /* @__PURE__ */ new Float32Array(6), Jp = class {
	constructor() {
		this._roots = null, this.primitiveBuffer = null, this.primitiveBufferStride = null;
	}
	init(e) {
		e = {
			...Jf,
			...e
		}, "maxLeafSize" in e && (console.warn("BVH: \"maxLeafSize\" option has been deprecated. Use \"targetLeafSize\", instead."), e = {
			...e,
			targetLeafSize: e.maxLeafSize
		}), Ep(this, e);
	}
	getRootRanges() {
		throw Error("BVH: getRootRanges() not implemented");
	}
	writePrimitiveBounds() {
		throw Error("BVH: writePrimitiveBounds() not implemented");
	}
	writePrimitiveRangeBounds(e, t, n, r) {
		let i = Infinity, a = Infinity, o = Infinity, s = -Infinity, c = -Infinity, l = -Infinity;
		for (let n = e, r = e + t; n < r; n++) {
			this.writePrimitiveBounds(n, qp, 0);
			let [e, t, r, u, d, f] = qp;
			e < i && (i = e), u > s && (s = u), t < a && (a = t), d > c && (c = d), r < o && (o = r), f > l && (l = f);
		}
		return n[r + 0] = i, n[r + 1] = a, n[r + 2] = o, n[r + 3] = s, n[r + 4] = c, n[r + 5] = l, n;
	}
	computePrimitiveBounds(e, t, n) {
		let r = n.offset || 0;
		for (let i = e, a = e + t; i < a; i++) {
			this.writePrimitiveBounds(i, qp, 0);
			let [e, t, a, o, s, c] = qp, l = (e + o) / 2, u = (t + s) / 2, d = (a + c) / 2, f = (o - e) / 2, p = (s - t) / 2, m = (c - a) / 2, h = (i - r) * 6;
			n[h + 0] = l, n[h + 1] = f + (Math.abs(l) + f) * Kf, n[h + 2] = u, n[h + 3] = p + (Math.abs(u) + p) * Kf, n[h + 4] = d, n[h + 5] = m + (Math.abs(d) + m) * Kf;
		}
		return n;
	}
	shiftPrimitiveOffsets(e) {
		let t = this._indirectBuffer;
		if (t) for (let n = 0, r = t.length; n < r; n++) t[n] += e;
		else {
			let t = this._roots;
			for (let n = 0; n < t.length; n++) {
				let r = t[n], i = new Uint32Array(r), a = new Uint16Array(r), o = r.byteLength / 32;
				for (let t = 0; t < o; t++) {
					let n = 8 * t;
					tp(2 * n, a) && (i[n + 6] += e);
				}
			}
		}
	}
	traverse(e, t = 0) {
		Gp.setBVH(this, t), Gp.traverse(e), Gp.reset();
	}
	refit() {
		let e = this._roots;
		for (let t = 0, n = e.length; t < n; t++) {
			let n = e[t], r = new Uint32Array(n), i = new Uint16Array(n), a = new Float32Array(n), o = n.byteLength / 32;
			for (let e = o - 1; e >= 0; e--) {
				let t = e * 8, n = t * 2;
				if (tp(n, i)) {
					let e = np(t, r), o = rp(n, i);
					this.writePrimitiveRangeBounds(e, o, qp, 0), a.set(qp, t);
				} else {
					let e = ip(t), n = ap(t, r);
					for (let r = 0; r < 3; r++) {
						let i = a[e + r], o = a[e + r + 3], s = a[n + r], c = a[n + r + 3];
						a[t + r] = i < s ? i : s, a[t + r + 3] = o > c ? o : c;
					}
				}
			}
		}
	}
	getBoundingBox(e) {
		return e.makeEmpty(), this._roots.forEach((t) => {
			Yf(0, new Float32Array(t), Kp), e.union(Kp);
		}), e;
	}
	shapecast(e) {
		let { boundsTraverseOrder: t, intersectsBounds: n, intersectsRange: r, intersectsPrimitive: i, scratchPrimitive: a, iterate: o } = e;
		if (r && i) {
			let e = r;
			r = (t, n, r, s, c) => e(t, n, r, s, c) ? !0 : o(t, n, this, i, r, s, a);
		} else r ||= i ? (e, t, n, r) => o(e, t, this, i, n, r, a) : (e, t, n) => n;
		let s = !1, c = 0, l = this._roots;
		for (let e = 0, i = l.length; e < i; e++) {
			let i = l[e];
			if (s = Np(this, e, n, r, t, c), s) break;
			c += i.byteLength / 32;
		}
		return s;
	}
	bvhcast(e, t, n) {
		let { intersectsRanges: r } = n;
		return Up(this, e, t, r);
	}
};
// node_modules/three-mesh-bvh/src/utils/BufferUtils.js
function Yp() {
	return typeof SharedArrayBuffer < "u";
}
// node_modules/three-mesh-bvh/src/core/build/geometryUtils.js
function Xp(e) {
	return e.index ? e.index.count : e.attributes.position.count;
}
function Zp(e) {
	return Xp(e) / 3;
}
function Qp(e, t = ArrayBuffer) {
	return e > 65535 ? new Uint32Array(new t(4 * e)) : new Uint16Array(new t(2 * e));
}
function $p(e, t) {
	if (!e.index) {
		let n = e.attributes.position.count, r = Qp(n, t.useSharedArrayBuffer ? SharedArrayBuffer : ArrayBuffer);
		e.setIndex(new pr(r, 1));
		for (let e = 0; e < n; e++) r[e] = e;
	}
}
function em(e, t, n) {
	let r = Xp(e) / n, i = t || e.drawRange, a = i.start / n, o = (i.start + i.count) / n, s = Math.max(0, a), c = Math.min(r, o) - s;
	return {
		offset: Math.floor(s),
		count: Math.floor(c)
	};
}
function tm(e, t) {
	return e.groups.map((e) => ({
		offset: e.start / t,
		count: e.count / t
	}));
}
function nm(e, t, n) {
	let r = em(e, t, n), i = tm(e, n);
	if (!i.length) return [r];
	let a = [], o = r.offset, s = r.offset + r.count, c = Xp(e) / n, l = [];
	for (let e of i) {
		let { offset: t, count: n } = e, r = t, i = t + (isFinite(n) ? n : c - t);
		r < s && i > o && (l.push({
			pos: Math.max(o, r),
			isStart: !0
		}), l.push({
			pos: Math.min(s, i),
			isStart: !1
		}));
	}
	l.sort((e, t) => e.pos === t.pos ? e.type === "end" ? -1 : 1 : e.pos - t.pos);
	let u = 0, d = null;
	for (let e of l) {
		let t = e.pos;
		u !== 0 && t !== d && a.push({
			offset: d,
			count: t - d
		}), u += e.isStart ? 1 : -1, d = t;
	}
	return a;
}
// node_modules/three-mesh-bvh/src/core/GeometryBVH.js
function rm(e, t) {
	let n = e[e.length - 1], r = n.offset + n.count > 2 ** 16, i = e.reduce((e, t) => e + t.count, 0), a = r ? 4 : 2, o = t ? new SharedArrayBuffer(i * a) : new ArrayBuffer(i * a), s = r ? new Uint32Array(o) : new Uint16Array(o), c = 0;
	for (let t = 0; t < e.length; t++) {
		let { offset: n, count: r } = e[t];
		for (let e = 0; e < r; e++) s[c + e] = n + e;
		c += r;
	}
	return s;
}
var im = class extends Jp {
	get indirect() {
		return !!this._indirectBuffer;
	}
	get primitiveStride() {
		return null;
	}
	get primitiveBufferStride() {
		return this.indirect ? 1 : this.primitiveStride;
	}
	set primitiveBufferStride(e) {}
	get primitiveBuffer() {
		return this.indirect ? this._indirectBuffer : this.geometry.index.array;
	}
	set primitiveBuffer(e) {}
	constructor(e, t = {}) {
		if (!e.isBufferGeometry) throw Error("BVH: Only BufferGeometries are supported.");
		if (e.index && e.index.isInterleavedBufferAttribute) throw Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.");
		if (t.useSharedArrayBuffer && !Yp()) throw Error("BVH: SharedArrayBuffer is not available.");
		super(), this.geometry = e, this.resolvePrimitiveIndex = t.indirect ? (e) => this._indirectBuffer[e] : (e) => e, this.primitiveBuffer = null, this.primitiveBufferStride = null, this._indirectBuffer = null, t = {
			...Jf,
			...t
		}, t[qf] || this.init(t);
	}
	init(e) {
		let { geometry: t, primitiveStride: n } = this;
		if (e.indirect) {
			let r = rm(nm(t, e.range, n), e.useSharedArrayBuffer);
			this._indirectBuffer = r;
		} else $p(t, e);
		super.init(e), !t.boundingBox && e.setBoundingBox && (t.boundingBox = this.getBoundingBox(new Yn()));
	}
	getRootRanges(e) {
		return this.indirect ? [{
			offset: 0,
			count: this._indirectBuffer.length
		}] : nm(this.geometry, e, this.primitiveStride);
	}
	raycastObject3D() {
		throw Error("BVH: raycastObject3D() not implemented");
	}
}, am = class {
	constructor() {
		this.min = Infinity, this.max = -Infinity;
	}
	setFromPointsField(e, t) {
		let n = Infinity, r = -Infinity;
		for (let i = 0, a = e.length; i < a; i++) {
			let a = e[i][t];
			n = a < n ? a : n, r = a > r ? a : r;
		}
		this.min = n, this.max = r;
	}
	setFromPoints(e, t) {
		let n = Infinity, r = -Infinity;
		for (let i = 0, a = t.length; i < a; i++) {
			let a = t[i], o = e.dot(a);
			n = o < n ? o : n, r = o > r ? o : r;
		}
		this.min = n, this.max = r;
	}
	isSeparated(e) {
		return this.min > e.max || e.min > this.max;
	}
};
am.prototype.setFromBox = (function() {
	let e = /* @__PURE__ */ new W();
	return function(t, n) {
		let r = n.min, i = n.max, a = Infinity, o = -Infinity;
		for (let n = 0; n <= 1; n++) for (let s = 0; s <= 1; s++) for (let c = 0; c <= 1; c++) {
			e.x = r.x * n + i.x * (1 - n), e.y = r.y * s + i.y * (1 - s), e.z = r.z * c + i.z * (1 - c);
			let l = t.dot(e);
			a = Math.min(l, a), o = Math.max(l, o);
		}
		this.min = a, this.max = o;
	};
})();
// node_modules/three-mesh-bvh/src/math/MathUtilities.js
var om = (function() {
	let e = /* @__PURE__ */ new W(), t = /* @__PURE__ */ new W(), n = /* @__PURE__ */ new W();
	return function(r, i, a) {
		let o = r.start, s = e, c = i.start, l = t;
		n.subVectors(o, c), e.subVectors(r.end, r.start), t.subVectors(i.end, i.start);
		let u = n.dot(l), d = l.dot(s), f = l.dot(l), p = n.dot(s), m = s.dot(s) * f - d * d, h, g;
		h = m === 0 ? 0 : (u * d - p * f) / m, g = (u + h * d) / f, a.x = h, a.y = g;
	};
})(), sm = (function() {
	let e = /* @__PURE__ */ new U(), t = /* @__PURE__ */ new W(), n = /* @__PURE__ */ new W();
	return function(r, i, a, o) {
		om(r, i, e);
		let s = e.x, c = e.y;
		if (s >= 0 && s <= 1 && c >= 0 && c <= 1) r.at(s, a), i.at(c, o);
		else if (s >= 0 && s <= 1) c < 0 ? i.at(0, o) : i.at(1, o), r.closestPointToPoint(o, !0, a);
		else if (c >= 0 && c <= 1) s < 0 ? r.at(0, a) : r.at(1, a), i.closestPointToPoint(a, !0, o);
		else {
			let e;
			e = s < 0 ? r.start : r.end;
			let l;
			l = c < 0 ? i.start : i.end;
			let u = t, d = n;
			if (r.closestPointToPoint(l, !0, t), i.closestPointToPoint(e, !0, n), u.distanceToSquared(l) <= d.distanceToSquared(e)) {
				a.copy(u), o.copy(l);
				return;
			}
			a.copy(e), o.copy(d);
			return;
		}
	};
})(), cm = (function() {
	let e = /* @__PURE__ */ new W(), t = /* @__PURE__ */ new W(), n = /* @__PURE__ */ new Fr(), r = /* @__PURE__ */ new Ys();
	return function(i, a) {
		let { radius: o, center: s } = i, { a: c, b: l, c: u } = a;
		if (r.start = c, r.end = l, r.closestPointToPoint(s, !0, e).distanceTo(s) <= o || (r.start = c, r.end = u, r.closestPointToPoint(s, !0, e).distanceTo(s) <= o) || (r.start = l, r.end = u, r.closestPointToPoint(s, !0, e).distanceTo(s) <= o)) return !0;
		let d = a.getPlane(n);
		if (Math.abs(d.distanceToPoint(s)) <= o) {
			let e = d.projectPoint(s, t);
			if (a.containsPoint(e)) return !0;
		}
		return !1;
	};
})(), lm = [
	"x",
	"y",
	"z"
], um = 1e-15, dm = um * um;
function fm(e) {
	return Math.abs(e) < um;
}
var pm = class extends Jn {
	constructor(...e) {
		super(...e), this.isExtendedTriangle = !0, this.satAxes = [
			,
			,
			,
			,
		].fill().map(() => new W()), this.satBounds = [
			,
			,
			,
			,
		].fill().map(() => new am()), this.points = [
			this.a,
			this.b,
			this.c
		], this.plane = new Fr(), this.isDegenerateIntoSegment = !1, this.isDegenerateIntoPoint = !1, this.degenerateSegment = new Ys(), this.needsUpdate = !0;
	}
	intersectsSphere(e) {
		return cm(e, this);
	}
	update() {
		let e = this.a, t = this.b, n = this.c, r = this.points, i = this.satAxes, a = this.satBounds, o = i[0], s = a[0];
		this.getNormal(o), s.setFromPoints(o, r);
		let c = i[1], l = a[1];
		c.subVectors(e, t), l.setFromPoints(c, r);
		let u = i[2], d = a[2];
		u.subVectors(t, n), d.setFromPoints(u, r);
		let f = i[3], p = a[3];
		f.subVectors(n, e), p.setFromPoints(f, r);
		let m = c.length(), h = u.length(), g = f.length();
		this.isDegenerateIntoPoint = !1, this.isDegenerateIntoSegment = !1, m < um ? h < um || g < um ? this.isDegenerateIntoPoint = !0 : (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(e), this.degenerateSegment.end.copy(n)) : h < um ? g < um ? this.isDegenerateIntoPoint = !0 : (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(t), this.degenerateSegment.end.copy(e)) : g < um && (this.isDegenerateIntoSegment = !0, this.degenerateSegment.start.copy(n), this.degenerateSegment.end.copy(t)), this.plane.setFromNormalAndCoplanarPoint(o, e), this.needsUpdate = !1;
	}
};
pm.prototype.closestPointToSegment = (function() {
	let e = /* @__PURE__ */ new W(), t = /* @__PURE__ */ new W(), n = /* @__PURE__ */ new Ys();
	return function(r, i = null, a = null) {
		let { start: o, end: s } = r, c = this.points, l, u = Infinity;
		for (let o = 0; o < 3; o++) {
			let s = (o + 1) % 3;
			n.start.copy(c[o]), n.end.copy(c[s]), sm(n, r, e, t), l = e.distanceToSquared(t), l < u && (u = l, i && i.copy(e), a && a.copy(t));
		}
		return this.closestPointToPoint(o, e), l = o.distanceToSquared(e), l < u && (u = l, i && i.copy(e), a && a.copy(o)), this.closestPointToPoint(s, e), l = s.distanceToSquared(e), l < u && (u = l, i && i.copy(e), a && a.copy(s)), Math.sqrt(u);
	};
})(), pm.prototype.intersectsTriangle = (function() {
	let e = /* @__PURE__ */ new pm(), t = /* @__PURE__ */ new am(), n = /* @__PURE__ */ new am(), r = /* @__PURE__ */ new W(), i = /* @__PURE__ */ new W(), a = /* @__PURE__ */ new W(), o = /* @__PURE__ */ new W(), s = /* @__PURE__ */ new Ys(), c = /* @__PURE__ */ new Ys(), l = /* @__PURE__ */ new W(), u = /* @__PURE__ */ new U(), d = /* @__PURE__ */ new U();
	function f(e, i, a, s) {
		let c = r;
		!e.isDegenerateIntoPoint && !e.isDegenerateIntoSegment ? c.copy(e.plane.normal) : c.copy(i.plane.normal);
		let l = e.satBounds, u = e.satAxes;
		for (let r = 1; r < 4; r++) {
			let a = l[r], s = u[r];
			if (t.setFromPoints(s, i.points), a.isSeparated(t) || (o.copy(c).cross(s), t.setFromPoints(o, e.points), n.setFromPoints(o, i.points), t.isSeparated(n))) return !1;
		}
		let d = i.satBounds, f = i.satAxes;
		for (let r = 1; r < 4; r++) {
			let a = d[r], s = f[r];
			if (t.setFromPoints(s, e.points), a.isSeparated(t) || (o.crossVectors(c, s), t.setFromPoints(o, e.points), n.setFromPoints(o, i.points), t.isSeparated(n))) return !1;
		}
		return a && (s || console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."), a.start.set(0, 0, 0), a.end.set(0, 0, 0)), !0;
	}
	function p(e, t, n, r, i, a, o, s, c, l, u) {
		let d = o / (o - s);
		l.x = r + (i - r) * d, u.start.subVectors(t, e).multiplyScalar(d).add(e), d = o / (o - c), l.y = r + (a - r) * d, u.end.subVectors(n, e).multiplyScalar(d).add(e);
	}
	function m(e, t, n, r, i, a, o, s, c, l, u) {
		if (i > 0) p(e.c, e.a, e.b, r, t, n, c, o, s, l, u);
		else if (a > 0) p(e.b, e.a, e.c, n, t, r, s, o, c, l, u);
		else if (s * c > 0 || o != 0) p(e.a, e.b, e.c, t, n, r, o, s, c, l, u);
		else if (s != 0) p(e.b, e.a, e.c, n, t, r, s, o, c, l, u);
		else if (c != 0) p(e.c, e.a, e.b, r, t, n, c, o, s, l, u);
		else return !0;
		return !1;
	}
	function h(e, t, n, i) {
		let a = t.degenerateSegment, o = e.plane.distanceToPoint(a.start), s = e.plane.distanceToPoint(a.end);
		return fm(o) ? fm(s) ? f(e, t, n, i) : (n && (n.start.copy(a.start), n.end.copy(a.start)), e.containsPoint(a.start)) : fm(s) ? (n && (n.start.copy(a.end), n.end.copy(a.end)), e.containsPoint(a.end)) : e.plane.intersectLine(a, r) != null && (n && (n.start.copy(r), n.end.copy(r)), e.containsPoint(r));
	}
	function g(e, t, n) {
		let r = t.a;
		return fm(e.plane.distanceToPoint(r)) && e.containsPoint(r) ? (n && (n.start.copy(r), n.end.copy(r)), !0) : !1;
	}
	function _(e, t, n) {
		let i = e.degenerateSegment, a = t.a;
		return i.closestPointToPoint(a, !0, r), a.distanceToSquared(r) < dm && (n && (n.start.copy(a), n.end.copy(a)), !0);
	}
	function v(e, t, n, o) {
		if (e.isDegenerateIntoSegment) {
			if (t.isDegenerateIntoSegment) {
				let o = e.degenerateSegment, s = t.degenerateSegment, c = i, l = a;
				o.delta(c), s.delta(l);
				let u = r.subVectors(s.start, o.start), d = c.x * l.y - c.y * l.x;
				if (fm(d)) return !1;
				let f = (u.x * l.y - u.y * l.x) / d, p = -(c.x * u.y - c.y * u.x) / d;
				return f < 0 || f > 1 || p < 0 || p > 1 ? !1 : fm(o.start.z + c.z * f - (s.start.z + l.z * p)) ? (n && (n.start.copy(o.start).addScaledVector(c, f), n.end.copy(o.start).addScaledVector(c, f)), !0) : !1;
			}
			return t.isDegenerateIntoPoint ? _(e, t, n) : h(t, e, n, o);
		}
		if (e.isDegenerateIntoPoint) return t.isDegenerateIntoPoint ? t.a.distanceToSquared(e.a) < dm && (n && (n.start.copy(e.a), n.end.copy(e.a)), !0) : t.isDegenerateIntoSegment ? _(t, e, n) : g(t, e, n);
		if (t.isDegenerateIntoPoint) return g(e, t, n);
		if (t.isDegenerateIntoSegment) return h(e, t, n, o);
	}
	return function(t, n = null, r = !1) {
		this.needsUpdate && this.update(), t.isExtendedTriangle ? t.needsUpdate && t.update() : (e.copy(t), e.update(), t = e);
		let o = v(this, t, n, r);
		if (o !== void 0) return o;
		let p = this.plane, h = t.plane, g = h.distanceToPoint(this.a), _ = h.distanceToPoint(this.b), y = h.distanceToPoint(this.c);
		fm(g) && (g = 0), fm(_) && (_ = 0), fm(y) && (y = 0);
		let b = g * _, x = g * y;
		if (b > 0 && x > 0) return !1;
		let S = p.distanceToPoint(t.a), C = p.distanceToPoint(t.b), w = p.distanceToPoint(t.c);
		fm(S) && (S = 0), fm(C) && (C = 0), fm(w) && (w = 0);
		let T = S * C, E = S * w;
		if (T > 0 && E > 0) return !1;
		i.copy(p.normal), a.copy(h.normal);
		let D = i.cross(a), O = 0, k = Math.abs(D.x), A = Math.abs(D.y);
		A > k && (k = A, O = 1), Math.abs(D.z) > k && (O = 2);
		let j = lm[O], ee = this.a[j], te = this.b[j], M = this.c[j], ne = t.a[j], N = t.b[j], re = t.c[j];
		if (m(this, ee, te, M, b, x, g, _, y, u, s) || m(t, ne, N, re, T, E, S, C, w, d, c)) return f(this, t, n, r);
		if (u.y < u.x) {
			let e = u.y;
			u.y = u.x, u.x = e, l.copy(s.start), s.start.copy(s.end), s.end.copy(l);
		}
		if (d.y < d.x) {
			let e = d.y;
			d.y = d.x, d.x = e, l.copy(c.start), c.start.copy(c.end), c.end.copy(l);
		}
		return u.y < d.x || d.y < u.x ? !1 : (n && (d.x > u.x ? n.start.copy(c.start) : n.start.copy(s.start), d.y < u.y ? n.end.copy(c.end) : n.end.copy(s.end)), !0);
	};
})(), pm.prototype.distanceToPoint = (function() {
	let e = /* @__PURE__ */ new W();
	return function(t) {
		return this.closestPointToPoint(t, e), t.distanceTo(e);
	};
})(), pm.prototype.distanceToTriangle = (function() {
	let e = /* @__PURE__ */ new W(), t = /* @__PURE__ */ new W(), n = [
		"a",
		"b",
		"c"
	], r = /* @__PURE__ */ new Ys(), i = /* @__PURE__ */ new Ys();
	return function(a, o = null, s = null) {
		let c = o || s ? r : null;
		if (this.intersectsTriangle(a, c, !0)) return (o || s) && (o && c.getCenter(o), s && c.getCenter(s)), 0;
		let l = Infinity;
		for (let t = 0; t < 3; t++) {
			let r, i = n[t], c = a[i];
			this.closestPointToPoint(c, e), r = c.distanceToSquared(e), r < l && (l = r, o && o.copy(e), s && s.copy(c));
			let u = this[i];
			a.closestPointToPoint(u, e), r = u.distanceToSquared(e), r < l && (l = r, o && o.copy(u), s && s.copy(e));
		}
		for (let c = 0; c < 3; c++) {
			let u = n[c], d = n[(c + 1) % 3];
			r.set(this[u], this[d]);
			for (let c = 0; c < 3; c++) {
				let u = n[c], d = n[(c + 1) % 3];
				i.set(a[u], a[d]), sm(r, i, e, t);
				let f = e.distanceToSquared(t);
				f < l && (l = f, o && o.copy(e), s && s.copy(t));
			}
		}
		return Math.sqrt(l);
	};
})();
// node_modules/three-mesh-bvh/src/math/OrientedBox.js
var mm = class {
	constructor(e, t, n) {
		this.isOrientedBox = !0, this.min = new W(), this.max = new W(), this.matrix = new q(), this.invMatrix = new q(), this.points = Array(8).fill().map(() => new W()), this.satAxes = [
			,
			,
			,
		].fill().map(() => new W()), this.satBounds = [
			,
			,
			,
		].fill().map(() => new am()), this.alignedSatBounds = [
			,
			,
			,
		].fill().map(() => new am()), this.needsUpdate = !1, e && this.min.copy(e), t && this.max.copy(t), n && this.matrix.copy(n);
	}
	set(e, t, n) {
		this.min.copy(e), this.max.copy(t), this.matrix.copy(n), this.needsUpdate = !0;
	}
	copy(e) {
		this.min.copy(e.min), this.max.copy(e.max), this.matrix.copy(e.matrix), this.needsUpdate = !0;
	}
};
mm.prototype.update = (function() {
	return function() {
		let e = this.matrix, t = this.min, n = this.max, r = this.points;
		for (let i = 0; i <= 1; i++) for (let a = 0; a <= 1; a++) for (let o = 0; o <= 1; o++) {
			let s = r[1 * i | 2 * a | 4 * o];
			s.x = i ? n.x : t.x, s.y = a ? n.y : t.y, s.z = o ? n.z : t.z, s.applyMatrix4(e);
		}
		let i = this.satBounds, a = this.satAxes, o = r[0];
		for (let e = 0; e < 3; e++) {
			let t = a[e], n = i[e], s = r[1 << e];
			t.subVectors(o, s), n.setFromPoints(t, r);
		}
		let s = this.alignedSatBounds;
		s[0].setFromPointsField(r, "x"), s[1].setFromPointsField(r, "y"), s[2].setFromPointsField(r, "z"), this.invMatrix.copy(this.matrix).invert(), this.needsUpdate = !1;
	};
})(), mm.prototype.intersectsBox = (function() {
	let e = /* @__PURE__ */ new am();
	return function(t) {
		this.needsUpdate && this.update();
		let n = t.min, r = t.max, i = this.satBounds, a = this.satAxes, o = this.alignedSatBounds;
		if (e.min = n.x, e.max = r.x, o[0].isSeparated(e) || (e.min = n.y, e.max = r.y, o[1].isSeparated(e)) || (e.min = n.z, e.max = r.z, o[2].isSeparated(e))) return !1;
		for (let n = 0; n < 3; n++) {
			let r = a[n], o = i[n];
			if (e.setFromBox(r, t), o.isSeparated(e)) return !1;
		}
		return !0;
	};
})(), mm.prototype.intersectsTriangle = (function() {
	let e = /* @__PURE__ */ new pm(), t = [
		,
		,
		,
	], n = /* @__PURE__ */ new am(), r = /* @__PURE__ */ new am(), i = /* @__PURE__ */ new W();
	return function(a) {
		this.needsUpdate && this.update(), a.isExtendedTriangle ? a.needsUpdate && a.update() : (e.copy(a), e.update(), a = e);
		let o = this.satBounds, s = this.satAxes;
		t[0] = a.a, t[1] = a.b, t[2] = a.c;
		for (let e = 0; e < 3; e++) {
			let r = o[e], i = s[e];
			if (n.setFromPoints(i, t), r.isSeparated(n)) return !1;
		}
		let c = a.satBounds, l = a.satAxes, u = this.points;
		for (let e = 0; e < 3; e++) {
			let t = c[e], r = l[e];
			if (n.setFromPoints(r, u), t.isSeparated(n)) return !1;
		}
		for (let e = 0; e < 3; e++) {
			let a = s[e];
			for (let e = 0; e < 4; e++) {
				let o = l[e];
				if (i.crossVectors(a, o), n.setFromPoints(i, t), r.setFromPoints(i, u), n.isSeparated(r)) return !1;
			}
		}
		return !0;
	};
})(), mm.prototype.closestPointToPoint = (function() {
	return function(e, t) {
		return this.needsUpdate && this.update(), t.copy(e).applyMatrix4(this.invMatrix).clamp(this.min, this.max).applyMatrix4(this.matrix), t;
	};
})(), mm.prototype.distanceToPoint = (function() {
	let e = new W();
	return function(t) {
		return this.closestPointToPoint(t, e), t.distanceTo(e);
	};
})(), mm.prototype.distanceToBox = (function() {
	let e = [
		"x",
		"y",
		"z"
	], t = /* @__PURE__ */ Array(12).fill().map(() => new Ys()), n = /* @__PURE__ */ Array(12).fill().map(() => new Ys()), r = /* @__PURE__ */ new W(), i = /* @__PURE__ */ new W();
	return function(a, o = 0, s = null, c = null) {
		if (this.needsUpdate && this.update(), this.intersectsBox(a)) return (s || c) && (a.getCenter(i), this.closestPointToPoint(i, r), a.closestPointToPoint(r, i), s && s.copy(r), c && c.copy(i)), 0;
		let l = o * o, u = a.min, d = a.max, f = this.points, p = Infinity;
		for (let e = 0; e < 8; e++) {
			let t = f[e];
			i.copy(t).clamp(u, d);
			let n = t.distanceToSquared(i);
			if (n < p && (p = n, s && s.copy(t), c && c.copy(i), n < l)) return Math.sqrt(n);
		}
		let m = 0;
		for (let r = 0; r < 3; r++) for (let i = 0; i <= 1; i++) for (let a = 0; a <= 1; a++) {
			let o = (r + 1) % 3, s = (r + 2) % 3, c = i << o | a << s, l = 1 << r | i << o | a << s, p = f[c], h = f[l];
			t[m].set(p, h);
			let g = e[r], _ = e[o], v = e[s], y = n[m], b = y.start, x = y.end;
			b[g] = u[g], b[_] = i ? u[_] : d[_], b[v] = a ? u[v] : d[_], x[g] = d[g], x[_] = i ? u[_] : d[_], x[v] = a ? u[v] : d[_], m++;
		}
		for (let e = 0; e <= 1; e++) for (let t = 0; t <= 1; t++) for (let n = 0; n <= 1; n++) {
			i.x = e ? d.x : u.x, i.y = t ? d.y : u.y, i.z = n ? d.z : u.z, this.closestPointToPoint(i, r);
			let a = i.distanceToSquared(r);
			if (a < p && (p = a, s && s.copy(r), c && c.copy(i), a < l)) return Math.sqrt(a);
		}
		for (let e = 0; e < 12; e++) {
			let a = t[e];
			for (let e = 0; e < 12; e++) {
				let t = n[e];
				sm(a, t, r, i);
				let o = r.distanceToSquared(i);
				if (o < p && (p = o, s && s.copy(r), c && c.copy(i), o < l)) return Math.sqrt(o);
			}
		}
		return Math.sqrt(p);
	};
})();
var hm = /* @__PURE__ */ new class extends Dp {
	constructor() {
		super(() => new pm());
	}
}(), gm = /* @__PURE__ */ new W(), _m = /* @__PURE__ */ new W();
function vm(e, t, n = {}, r = 0, i = Infinity) {
	let a = r * r, o = i * i, s = Infinity, c = null;
	if (e.shapecast({
		boundsTraverseOrder: (e) => (gm.copy(t).clamp(e.min, e.max), gm.distanceToSquared(t)),
		intersectsBounds: (e, t, n) => n < s && n < o,
		intersectsTriangle: (e, n) => {
			e.closestPointToPoint(t, gm);
			let r = t.distanceToSquared(gm);
			return r < s && (_m.copy(gm), s = r, c = n), r < a;
		}
	}), s === Infinity) return null;
	let l = Math.sqrt(s);
	return n.point ? n.point.copy(_m) : n.point = _m.clone(), n.distance = l, n.faceIndex = c, n;
}
// node_modules/three-mesh-bvh/src/utils/ThreeRayIntersectUtilities.js
var ym = !0, bm = /* @__PURE__ */ new W(), xm = /* @__PURE__ */ new W(), Sm = /* @__PURE__ */ new W(), Cm = /* @__PURE__ */ new U(), wm = /* @__PURE__ */ new U(), Tm = /* @__PURE__ */ new U(), Em = /* @__PURE__ */ new W(), Dm = /* @__PURE__ */ new W(), Om = /* @__PURE__ */ new W(), km = /* @__PURE__ */ new W();
function Am(e, t, n, r, i, a, o, s) {
	let c;
	if (c = a === 1 ? e.intersectTriangle(r, n, t, !0, i) : e.intersectTriangle(t, n, r, a !== 2, i), c === null) return null;
	let l = e.origin.distanceTo(i);
	return l < o || l > s ? null : {
		distance: l,
		point: i.clone()
	};
}
function jm(e, t, n, r, i, a, o, s, c, l, u) {
	bm.fromBufferAttribute(t, a), xm.fromBufferAttribute(t, o), Sm.fromBufferAttribute(t, s);
	let d = Am(e, bm, xm, Sm, km, c, l, u);
	if (d) {
		if (r) {
			Cm.fromBufferAttribute(r, a), wm.fromBufferAttribute(r, o), Tm.fromBufferAttribute(r, s), d.uv = new U();
			let e = Jn.getInterpolation(km, bm, xm, Sm, Cm, wm, Tm, d.uv);
			ym || (d.uv = e);
		}
		if (i) {
			Cm.fromBufferAttribute(i, a), wm.fromBufferAttribute(i, o), Tm.fromBufferAttribute(i, s), d.uv1 = new U();
			let e = Jn.getInterpolation(km, bm, xm, Sm, Cm, wm, Tm, d.uv1);
			ym || (d.uv1 = e);
		}
		if (n) {
			Em.fromBufferAttribute(n, a), Dm.fromBufferAttribute(n, o), Om.fromBufferAttribute(n, s), d.normal = new W();
			let t = Jn.getInterpolation(km, bm, xm, Sm, Em, Dm, Om, d.normal);
			d.normal.dot(e.direction) > 0 && d.normal.multiplyScalar(-1), ym || (d.normal = t);
		}
		let t = {
			a,
			b: o,
			c: s,
			normal: new W(),
			materialIndex: 0
		};
		if (Jn.getNormal(bm, xm, Sm, t.normal), d.face = t, d.faceIndex = a, ym) {
			let e = new W();
			Jn.getBarycoord(km, bm, xm, Sm, e), d.barycoord = e;
		}
	}
	return d;
}
function Mm(e) {
	return e && e.isMaterial ? e.side : e;
}
function Nm(e, t, n, r, i, a, o) {
	let s = r * 3, c = s + 0, l = s + 1, u = s + 2, { index: d, groups: f } = e;
	e.index && (c = d.getX(c), l = d.getX(l), u = d.getX(u));
	let { position: p, normal: m, uv: h, uv1: g } = e.attributes;
	if (Array.isArray(t)) {
		let e = r * 3;
		for (let s = 0, d = f.length; s < d; s++) {
			let { start: d, count: _, materialIndex: v } = f[s];
			if (e >= d && e < d + _) {
				let e = Mm(t[v]), s = jm(n, p, m, h, g, c, l, u, e, a, o);
				if (s) {
					if (s.faceIndex = r, s.face.materialIndex = v, i) i.push(s);
					else return s;
				}
			}
		}
	} else {
		let e = Mm(t), s = jm(n, p, m, h, g, c, l, u, e, a, o);
		if (s) {
			if (s.faceIndex = r, s.face.materialIndex = 0, i) i.push(s);
			else return s;
		}
	}
	return null;
}
// node_modules/three-mesh-bvh/src/utils/TriangleUtilities.js
function Pm(e, t, n, r) {
	let i = e.a, a = e.b, o = e.c, s = t, c = t + 1, l = t + 2;
	n && (s = n.getX(s), c = n.getX(c), l = n.getX(l)), i.x = r.getX(s), i.y = r.getY(s), i.z = r.getZ(s), a.x = r.getX(c), a.y = r.getY(c), a.z = r.getZ(c), o.x = r.getX(l), o.y = r.getY(l), o.z = r.getZ(l);
}
// node_modules/three-mesh-bvh/src/core/utils/iterationUtils.generated.js
function Fm(e, t, n, r, i, a, o, s) {
	let { geometry: c, _indirectBuffer: l } = e;
	for (let e = r, l = r + i; e < l; e++) Nm(c, t, n, e, a, o, s);
}
function Im(e, t, n, r, i, a, o) {
	let { geometry: s, _indirectBuffer: c } = e, l = Infinity, u = null;
	for (let e = r, c = r + i; e < c; e++) {
		let r;
		r = Nm(s, t, n, e, null, a, o), r && r.distance < l && (u = r, l = r.distance);
	}
	return u;
}
function Lm(e, t, n, r, i, a, o) {
	let { geometry: s } = n, { index: c } = s, l = s.attributes.position;
	for (let n = e, s = t + e; n < s; n++) {
		let e;
		if (e = n, Pm(o, e * 3, c, l), o.needsUpdate = !0, r(o, e, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/core/cast/refit.generated.js
function Rm(e, t = null) {
	t && Array.isArray(t) && (t = new Set(t));
	let n = e.geometry, r = n.index ? n.index.array : null, i = n.attributes.position, a, o, s, c, l = 0, u = e._roots;
	for (let e = 0, t = u.length; e < t; e++) a = u[e], o = new Uint32Array(a), s = new Uint16Array(a), c = new Float32Array(a), d(0, l), l += a.byteLength;
	function d(e, n, a = !1) {
		let l = e * 2;
		if (tp(l, s)) {
			let t = np(e, o), n = rp(l, s), a = Infinity, u = Infinity, d = Infinity, f = -Infinity, p = -Infinity, m = -Infinity;
			for (let e = 3 * t, o = 3 * (t + n); e < o; e++) {
				let t = r[e], n = i.getX(t), o = i.getY(t), s = i.getZ(t);
				n < a && (a = n), n > f && (f = n), o < u && (u = o), o > p && (p = o), s < d && (d = s), s > m && (m = s);
			}
			return c[e + 0] !== a || c[e + 1] !== u || c[e + 2] !== d || c[e + 3] !== f || c[e + 4] !== p || c[e + 5] !== m ? (c[e + 0] = a, c[e + 1] = u, c[e + 2] = d, c[e + 3] = f, c[e + 4] = p, c[e + 5] = m, !0) : !1;
		}
		{
			let r = ip(e), i = ap(e, o), s = a, l = !1, u = !1;
			if (t) {
				if (!s) {
					let e = r / 8 + n / 32, a = i / 8 + n / 32;
					l = t.has(e), u = t.has(a), s = !l && !u;
				}
			} else l = !0, u = !0;
			let f = s || l, p = s || u, m = !1;
			f && (m = d(r, n, s));
			let h = !1;
			p && (h = d(i, n, s));
			let g = m || h;
			if (g) for (let t = 0; t < 3; t++) {
				let n = r + t, a = i + t, o = c[n], s = c[n + 3], l = c[a], u = c[a + 3];
				c[e + t] = o < l ? o : l, c[e + t + 3] = s > u ? s : u;
			}
			return g;
		}
	}
}
// node_modules/three-mesh-bvh/src/core/utils/intersectUtils.js
function zm(e, t, n, r, i) {
	let a, o, s, c, l, u, d = 1 / n.direction.x, f = 1 / n.direction.y, p = 1 / n.direction.z, m = n.origin.x, h = n.origin.y, g = n.origin.z, _ = t[e], v = t[e + 3], y = t[e + 1], b = t[e + 3 + 1], x = t[e + 2], S = t[e + 3 + 2];
	return d >= 0 ? (a = (_ - m) * d, o = (v - m) * d) : (a = (v - m) * d, o = (_ - m) * d), f >= 0 ? (s = (y - h) * f, c = (b - h) * f) : (s = (b - h) * f, c = (y - h) * f), a > c || s > o || ((s > a || isNaN(a)) && (a = s), (c < o || isNaN(o)) && (o = c), p >= 0 ? (l = (x - g) * p, u = (S - g) * p) : (l = (S - g) * p, u = (x - g) * p), a > u || l > o) ? !1 : ((l > a || a !== a) && (a = l), (u < o || o !== o) && (o = u), a <= i && o >= r);
}
// node_modules/three-mesh-bvh/src/core/utils/iterationUtils_indirect.generated.js
function Bm(e, t, n, r, i, a, o, s) {
	let { geometry: c, _indirectBuffer: l } = e;
	for (let e = r, u = r + i; e < u; e++) Nm(c, t, n, l ? l[e] : e, a, o, s);
}
function Vm(e, t, n, r, i, a, o) {
	let { geometry: s, _indirectBuffer: c } = e, l = Infinity, u = null;
	for (let e = r, d = r + i; e < d; e++) {
		let r;
		r = Nm(s, t, n, c ? c[e] : e, null, a, o), r && r.distance < l && (u = r, l = r.distance);
	}
	return u;
}
function Hm(e, t, n, r, i, a, o) {
	let { geometry: s } = n, { index: c } = s, l = s.attributes.position;
	for (let s = e, u = t + e; s < u; s++) {
		let e;
		if (e = n.resolveTriangleIndex(s), Pm(o, e * 3, c, l), o.needsUpdate = !0, r(o, e, i, a)) return !0;
	}
	return !1;
}
// node_modules/three-mesh-bvh/src/core/cast/raycast.generated.js
function Um(e, t, n, r, i, a, o) {
	Op.setBuffer(e._roots[t]), Wm(0, e, n, r, i, a, o), Op.clearBuffer();
}
function Wm(e, t, n, r, i, a, o) {
	let { float32Array: s, uint16Array: c, uint32Array: l } = Op, u = e * 2;
	if (tp(u, c)) Fm(t, n, r, np(e, l), rp(u, c), i, a, o);
	else {
		let c = ip(e);
		zm(c, s, r, a, o) && Wm(c, t, n, r, i, a, o);
		let u = ap(e, l);
		zm(u, s, r, a, o) && Wm(u, t, n, r, i, a, o);
	}
}
// node_modules/three-mesh-bvh/src/core/cast/raycastFirst.generated.js
var Gm = [
	"x",
	"y",
	"z"
];
function Km(e, t, n, r, i, a) {
	Op.setBuffer(e._roots[t]);
	let o = qm(0, e, n, r, i, a);
	return Op.clearBuffer(), o;
}
function qm(e, t, n, r, i, a) {
	let { float32Array: o, uint16Array: s, uint32Array: c } = Op, l = e * 2;
	if (tp(l, s)) return Im(t, n, r, np(e, c), rp(l, s), i, a);
	{
		let s = op(e, c), l = Gm[s], u = r.direction[l] >= 0, d, f;
		u ? (d = ip(e), f = ap(e, c)) : (d = ap(e, c), f = ip(e));
		let p = zm(d, o, r, i, a) ? qm(d, t, n, r, i, a) : null;
		if (p) {
			let e = p.point[l];
			if (u ? e <= o[f + s] : e >= o[f + s + 3]) return p;
		}
		let m = zm(f, o, r, i, a) ? qm(f, t, n, r, i, a) : null;
		return p && m ? p.distance <= m.distance ? p : m : p || m || null;
	}
}
// node_modules/three-mesh-bvh/src/core/cast/intersectsGeometry.generated.js
var Jm = /* @__PURE__ */ new Yn(), Ym = /* @__PURE__ */ new pm(), Xm = /* @__PURE__ */ new pm(), Zm = /* @__PURE__ */ new q(), Qm = /* @__PURE__ */ new mm(), $m = /* @__PURE__ */ new mm();
function eh(e, t, n, r) {
	Op.setBuffer(e._roots[t]);
	let i = th(0, e, n, r);
	return Op.clearBuffer(), i;
}
function th(e, t, n, r, i = null) {
	let { float32Array: a, uint16Array: o, uint32Array: s } = Op, c = e * 2;
	if (i === null && (n.boundingBox || n.computeBoundingBox(), Qm.set(n.boundingBox.min, n.boundingBox.max, r), i = Qm), tp(c, o)) {
		let i = t.geometry, l = i.index, u = i.attributes.position, d = n.index, f = n.attributes.position, p = np(e, s), m = rp(c, o);
		if (Zm.copy(r).invert(), n.boundsTree) return Yf(sp(e), a, $m), $m.matrix.copy(Zm), $m.needsUpdate = !0, n.boundsTree.shapecast({
			intersectsBounds: (e) => $m.intersectsBox(e),
			intersectsTriangle: (e) => {
				e.a.applyMatrix4(r), e.b.applyMatrix4(r), e.c.applyMatrix4(r), e.needsUpdate = !0;
				for (let t = p * 3, n = (m + p) * 3; t < n; t += 3) if (Pm(Xm, t, l, u), Xm.needsUpdate = !0, e.intersectsTriangle(Xm)) return !0;
				return !1;
			}
		});
		{
			let e = Zp(n);
			for (let t = p * 3, n = (m + p) * 3; t < n; t += 3) {
				Pm(Ym, t, l, u), Ym.a.applyMatrix4(Zm), Ym.b.applyMatrix4(Zm), Ym.c.applyMatrix4(Zm), Ym.needsUpdate = !0;
				for (let t = 0, n = e * 3; t < n; t += 3) if (Pm(Xm, t, d, f), Xm.needsUpdate = !0, Ym.intersectsTriangle(Xm)) return !0;
			}
		}
	} else {
		let o = ip(e), c = ap(e, s);
		return Yf(sp(o), a, Jm), !!(i.intersectsBox(Jm) && th(o, t, n, r, i) || (Yf(sp(c), a, Jm), i.intersectsBox(Jm) && th(c, t, n, r, i)));
	}
}
// node_modules/three-mesh-bvh/src/core/cast/closestPointToGeometry.generated.js
var nh = /* @__PURE__ */ new q(), rh = /* @__PURE__ */ new mm(), ih = /* @__PURE__ */ new mm(), ah = /* @__PURE__ */ new W(), oh = /* @__PURE__ */ new W(), sh = /* @__PURE__ */ new W(), ch = /* @__PURE__ */ new W();
function lh(e, t, n, r = {}, i = {}, a = 0, o = Infinity) {
	t.boundingBox || t.computeBoundingBox(), rh.set(t.boundingBox.min, t.boundingBox.max, n), rh.needsUpdate = !0;
	let s = e.geometry, c = s.attributes.position, l = s.index, u = t.attributes.position, d = t.index, f = hm.getPrimitive(), p = hm.getPrimitive(), m = ah, h = oh, g = null, _ = null;
	i && (g = sh, _ = ch);
	let v = Infinity, y = null, b = null;
	return nh.copy(n).invert(), ih.matrix.copy(nh), e.shapecast({
		boundsTraverseOrder: (e) => rh.distanceToBox(e),
		intersectsBounds: (e, t, n) => n < v && n < o && (t && (ih.min.copy(e.min), ih.max.copy(e.max), ih.needsUpdate = !0), !0),
		intersectsRange: (e, r) => {
			if (t.boundsTree) return t.boundsTree.shapecast({
				boundsTraverseOrder: (e) => ih.distanceToBox(e),
				intersectsBounds: (e, t, n) => n < v && n < o,
				intersectsRange: (t, i) => {
					for (let o = t, s = t + i; o < s; o++) {
						Pm(p, 3 * o, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
						for (let t = e, n = e + r; t < n; t++) {
							Pm(f, 3 * t, l, c), f.needsUpdate = !0;
							let e = f.distanceToTriangle(p, m, g);
							if (e < v && (h.copy(m), _ && _.copy(g), v = e, y = t, b = o), e < a) return !0;
						}
					}
				}
			});
			{
				let i = Zp(t);
				for (let t = 0, o = i; t < o; t++) {
					Pm(p, 3 * t, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
					for (let n = e, i = e + r; n < i; n++) {
						Pm(f, 3 * n, l, c), f.needsUpdate = !0;
						let e = f.distanceToTriangle(p, m, g);
						if (e < v && (h.copy(m), _ && _.copy(g), v = e, y = n, b = t), e < a) return !0;
					}
				}
			}
		}
	}), hm.releasePrimitive(f), hm.releasePrimitive(p), v === Infinity ? null : (r.point ? r.point.copy(h) : r.point = h.clone(), r.distance = v, r.faceIndex = y, i && (i.point ? i.point.copy(_) : i.point = _.clone(), i.point.applyMatrix4(nh), h.applyMatrix4(nh), i.distance = h.sub(i.point).length(), i.faceIndex = b), r);
}
// node_modules/three-mesh-bvh/src/core/cast/refit_indirect.generated.js
function uh(e, t = null) {
	t && Array.isArray(t) && (t = new Set(t));
	let n = e.geometry, r = n.index ? n.index.array : null, i = n.attributes.position, a, o, s, c, l = 0, u = e._roots;
	for (let e = 0, t = u.length; e < t; e++) a = u[e], o = new Uint32Array(a), s = new Uint16Array(a), c = new Float32Array(a), d(0, l), l += a.byteLength;
	function d(n, a, l = !1) {
		let u = n * 2;
		if (tp(u, s)) {
			let t = np(n, o), a = rp(u, s), l = Infinity, d = Infinity, f = Infinity, p = -Infinity, m = -Infinity, h = -Infinity;
			for (let n = t, o = t + a; n < o; n++) {
				let t = 3 * e.resolveTriangleIndex(n);
				for (let e = 0; e < 3; e++) {
					let n = t + e;
					n = r ? r[n] : n;
					let a = i.getX(n), o = i.getY(n), s = i.getZ(n);
					a < l && (l = a), a > p && (p = a), o < d && (d = o), o > m && (m = o), s < f && (f = s), s > h && (h = s);
				}
			}
			return c[n + 0] !== l || c[n + 1] !== d || c[n + 2] !== f || c[n + 3] !== p || c[n + 4] !== m || c[n + 5] !== h ? (c[n + 0] = l, c[n + 1] = d, c[n + 2] = f, c[n + 3] = p, c[n + 4] = m, c[n + 5] = h, !0) : !1;
		}
		{
			let e = ip(n), r = ap(n, o), i = l, s = !1, u = !1;
			if (t) {
				if (!i) {
					let n = e / 8 + a / 32, o = r / 8 + a / 32;
					s = t.has(n), u = t.has(o), i = !s && !u;
				}
			} else s = !0, u = !0;
			let f = i || s, p = i || u, m = !1;
			f && (m = d(e, a, i));
			let h = !1;
			p && (h = d(r, a, i));
			let g = m || h;
			if (g) for (let t = 0; t < 3; t++) {
				let i = e + t, a = r + t, o = c[i], s = c[i + 3], l = c[a], u = c[a + 3];
				c[n + t] = o < l ? o : l, c[n + t + 3] = s > u ? s : u;
			}
			return g;
		}
	}
}
// node_modules/three-mesh-bvh/src/core/cast/raycast_indirect.generated.js
function dh(e, t, n, r, i, a, o) {
	Op.setBuffer(e._roots[t]), fh(0, e, n, r, i, a, o), Op.clearBuffer();
}
function fh(e, t, n, r, i, a, o) {
	let { float32Array: s, uint16Array: c, uint32Array: l } = Op, u = e * 2;
	if (tp(u, c)) Bm(t, n, r, np(e, l), rp(u, c), i, a, o);
	else {
		let c = ip(e);
		zm(c, s, r, a, o) && fh(c, t, n, r, i, a, o);
		let u = ap(e, l);
		zm(u, s, r, a, o) && fh(u, t, n, r, i, a, o);
	}
}
// node_modules/three-mesh-bvh/src/core/cast/raycastFirst_indirect.generated.js
var ph = [
	"x",
	"y",
	"z"
];
function mh(e, t, n, r, i, a) {
	Op.setBuffer(e._roots[t]);
	let o = hh(0, e, n, r, i, a);
	return Op.clearBuffer(), o;
}
function hh(e, t, n, r, i, a) {
	let { float32Array: o, uint16Array: s, uint32Array: c } = Op, l = e * 2;
	if (tp(l, s)) return Vm(t, n, r, np(e, c), rp(l, s), i, a);
	{
		let s = op(e, c), l = ph[s], u = r.direction[l] >= 0, d, f;
		u ? (d = ip(e), f = ap(e, c)) : (d = ap(e, c), f = ip(e));
		let p = zm(d, o, r, i, a) ? hh(d, t, n, r, i, a) : null;
		if (p) {
			let e = p.point[l];
			if (u ? e <= o[f + s] : e >= o[f + s + 3]) return p;
		}
		let m = zm(f, o, r, i, a) ? hh(f, t, n, r, i, a) : null;
		return p && m ? p.distance <= m.distance ? p : m : p || m || null;
	}
}
// node_modules/three-mesh-bvh/src/core/cast/intersectsGeometry_indirect.generated.js
var gh = /* @__PURE__ */ new Yn(), _h = /* @__PURE__ */ new pm(), vh = /* @__PURE__ */ new pm(), yh = /* @__PURE__ */ new q(), bh = /* @__PURE__ */ new mm(), xh = /* @__PURE__ */ new mm();
function Sh(e, t, n, r) {
	Op.setBuffer(e._roots[t]);
	let i = Ch(0, e, n, r);
	return Op.clearBuffer(), i;
}
function Ch(e, t, n, r, i = null) {
	let { float32Array: a, uint16Array: o, uint32Array: s } = Op, c = e * 2;
	if (i === null && (n.boundingBox || n.computeBoundingBox(), bh.set(n.boundingBox.min, n.boundingBox.max, r), i = bh), tp(c, o)) {
		let i = t.geometry, l = i.index, u = i.attributes.position, d = n.index, f = n.attributes.position, p = np(e, s), m = rp(c, o);
		if (yh.copy(r).invert(), n.boundsTree) return Yf(sp(e), a, xh), xh.matrix.copy(yh), xh.needsUpdate = !0, n.boundsTree.shapecast({
			intersectsBounds: (e) => xh.intersectsBox(e),
			intersectsTriangle: (e) => {
				e.a.applyMatrix4(r), e.b.applyMatrix4(r), e.c.applyMatrix4(r), e.needsUpdate = !0;
				for (let n = p, r = m + p; n < r; n++) if (Pm(vh, 3 * t.resolveTriangleIndex(n), l, u), vh.needsUpdate = !0, e.intersectsTriangle(vh)) return !0;
				return !1;
			}
		});
		{
			let e = Zp(n);
			for (let n = p, r = m + p; n < r; n++) {
				Pm(_h, 3 * t.resolveTriangleIndex(n), l, u), _h.a.applyMatrix4(yh), _h.b.applyMatrix4(yh), _h.c.applyMatrix4(yh), _h.needsUpdate = !0;
				for (let t = 0, n = e * 3; t < n; t += 3) if (Pm(vh, t, d, f), vh.needsUpdate = !0, _h.intersectsTriangle(vh)) return !0;
			}
		}
	} else {
		let o = ip(e), c = ap(e, s);
		return Yf(sp(o), a, gh), !!(i.intersectsBox(gh) && Ch(o, t, n, r, i) || (Yf(sp(c), a, gh), i.intersectsBox(gh) && Ch(c, t, n, r, i)));
	}
}
// node_modules/three-mesh-bvh/src/core/cast/closestPointToGeometry_indirect.generated.js
var wh = /* @__PURE__ */ new q(), Th = /* @__PURE__ */ new mm(), Eh = /* @__PURE__ */ new mm(), Dh = /* @__PURE__ */ new W(), Oh = /* @__PURE__ */ new W(), kh = /* @__PURE__ */ new W(), Ah = /* @__PURE__ */ new W();
function jh(e, t, n, r = {}, i = {}, a = 0, o = Infinity) {
	t.boundingBox || t.computeBoundingBox(), Th.set(t.boundingBox.min, t.boundingBox.max, n), Th.needsUpdate = !0;
	let s = e.geometry, c = s.attributes.position, l = s.index, u = t.attributes.position, d = t.index, f = hm.getPrimitive(), p = hm.getPrimitive(), m = Dh, h = Oh, g = null, _ = null;
	i && (g = kh, _ = Ah);
	let v = Infinity, y = null, b = null;
	return wh.copy(n).invert(), Eh.matrix.copy(wh), e.shapecast({
		boundsTraverseOrder: (e) => Th.distanceToBox(e),
		intersectsBounds: (e, t, n) => n < v && n < o && (t && (Eh.min.copy(e.min), Eh.max.copy(e.max), Eh.needsUpdate = !0), !0),
		intersectsRange: (r, i) => {
			if (t.boundsTree) {
				let s = t.boundsTree;
				return s.shapecast({
					boundsTraverseOrder: (e) => Eh.distanceToBox(e),
					intersectsBounds: (e, t, n) => n < v && n < o,
					intersectsRange: (t, o) => {
						for (let x = t, S = t + o; x < S; x++) {
							let t = s.resolveTriangleIndex(x);
							Pm(p, 3 * t, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
							for (let t = r, n = r + i; t < n; t++) {
								let n = e.resolveTriangleIndex(t);
								Pm(f, 3 * n, l, c), f.needsUpdate = !0;
								let r = f.distanceToTriangle(p, m, g);
								if (r < v && (h.copy(m), _ && _.copy(g), v = r, y = t, b = x), r < a) return !0;
							}
						}
					}
				});
			}
			{
				let o = Zp(t);
				for (let t = 0, s = o; t < s; t++) {
					Pm(p, 3 * t, d, u), p.a.applyMatrix4(n), p.b.applyMatrix4(n), p.c.applyMatrix4(n), p.needsUpdate = !0;
					for (let n = r, o = r + i; n < o; n++) {
						let r = e.resolveTriangleIndex(n);
						Pm(f, 3 * r, l, c), f.needsUpdate = !0;
						let i = f.distanceToTriangle(p, m, g);
						if (i < v && (h.copy(m), _ && _.copy(g), v = i, y = n, b = t), i < a) return !0;
					}
				}
			}
		}
	}), hm.releasePrimitive(f), hm.releasePrimitive(p), v === Infinity ? null : (r.point ? r.point.copy(h) : r.point = h.clone(), r.distance = v, r.faceIndex = y, i && (i.point ? i.point.copy(_) : i.point = _.clone(), i.point.applyMatrix4(wh), h.applyMatrix4(wh), i.distance = h.sub(i.point).length(), i.faceIndex = b), r);
}
// node_modules/three-mesh-bvh/src/utils/GeometryRayIntersectUtilities.js
function Mh(e, t, n) {
	return e === null ? null : (e.point.applyMatrix4(t.matrixWorld), e.distance = e.point.distanceTo(n.ray.origin), e.object = t, e);
}
// node_modules/three-mesh-bvh/src/core/MeshBVH.js
var Nh = /* @__PURE__ */ new mm(), Ph = /* @__PURE__ */ new Hr(), Fh = /* @__PURE__ */ new W(), Ih = /* @__PURE__ */ new q(), Lh = /* @__PURE__ */ new W(), Rh = [
	"getX",
	"getY",
	"getZ"
], zh = class e extends im {
	static serialize(e, t = {}) {
		t = {
			cloneBuffers: !0,
			...t
		};
		let n = e.geometry, r = e._roots, i = e._indirectBuffer, a = n.getIndex(), o = {
			version: 1,
			roots: null,
			index: null,
			indirectBuffer: null
		};
		return t.cloneBuffers ? (o.roots = r.map((e) => e.slice()), o.index = a ? a.array.slice() : null, o.indirectBuffer = i ? i.slice() : null) : (o.roots = r, o.index = a ? a.array : null, o.indirectBuffer = i), o;
	}
	static deserialize(t, n, r = {}) {
		r = {
			setIndex: !0,
			indirect: !!t.indirectBuffer,
			...r
		};
		let { index: i, roots: a, indirectBuffer: o } = t;
		t.version || (console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."), c(a));
		let s = new e(n, {
			...r,
			[qf]: !0
		});
		if (s._roots = a, s._indirectBuffer = o || null, r.setIndex) {
			let e = n.getIndex();
			if (e === null) {
				let e = new pr(t.index, 1, !1);
				n.setIndex(e);
			} else e.array !== i && (e.array.set(i), e.needsUpdate = !0);
		}
		return s;
		function c(e) {
			for (let t = 0; t < e.length; t++) {
				let n = e[t], r = new Uint32Array(n), i = new Uint16Array(n);
				for (let e = 0, t = n.byteLength / 32; e < t; e++) {
					let t = 8 * e;
					tp(2 * t, i) || (r[t + 6] = r[t + 6] / 8 - e);
				}
			}
		}
	}
	get primitiveStride() {
		return 3;
	}
	get resolveTriangleIndex() {
		return this.resolvePrimitiveIndex;
	}
	constructor(e, t = {}) {
		t.maxLeafTris && (console.warn("MeshBVH: \"maxLeafTris\" option has been deprecated. Use \"targetLeafSize\", instead."), t = {
			...t,
			targetLeafSize: t.maxLeafTris
		}), super(e, t);
	}
	shiftTriangleOffsets(e) {
		return super.shiftPrimitiveOffsets(e);
	}
	writePrimitiveBounds(e, t, n) {
		let r = this.geometry, i = this._indirectBuffer, a = r.attributes.position, o = r.index ? r.index.array : null, s = (i ? i[e] : e) * 3, c = s + 0, l = s + 1, u = s + 2;
		o && (c = o[c], l = o[l], u = o[u]);
		for (let e = 0; e < 3; e++) {
			let r = a[Rh[e]](c), i = a[Rh[e]](l), o = a[Rh[e]](u), s = r;
			i < s && (s = i), o < s && (s = o);
			let d = r;
			i > d && (d = i), o > d && (d = o), t[n + e] = s, t[n + e + 3] = d;
		}
		return t;
	}
	computePrimitiveBounds(e, t, n) {
		let r = this.geometry, i = this._indirectBuffer, a = r.attributes.position, o = r.index ? r.index.array : null, s = a.normalized;
		if (e < 0 || t + e - n.offset > n.length / 6) throw Error("MeshBVH: compute triangle bounds range is invalid.");
		let c = a.array, l = a.offset || 0, u = 3;
		a.isInterleavedBufferAttribute && (u = a.data.stride);
		let d = [
			"getX",
			"getY",
			"getZ"
		], f = n.offset;
		for (let r = e, p = e + t; r < p; r++) {
			let e = (i ? i[r] : r) * 3, t = (r - f) * 6, p = e + 0, m = e + 1, h = e + 2;
			o && (p = o[p], m = o[m], h = o[h]), s || (p = p * u + l, m = m * u + l, h = h * u + l);
			for (let e = 0; e < 3; e++) {
				let r, i, o;
				s ? (r = a[d[e]](p), i = a[d[e]](m), o = a[d[e]](h)) : (r = c[p + e], i = c[m + e], o = c[h + e]);
				let l = r;
				i < l && (l = i), o < l && (l = o);
				let u = r;
				i > u && (u = i), o > u && (u = o);
				let f = (u - l) / 2, g = e * 2;
				n[t + g + 0] = l + f, n[t + g + 1] = f + (Math.abs(l) + f) * Kf;
			}
		}
		return n;
	}
	raycastObject3D(e, t, n = []) {
		let { material: r } = e;
		if (r === void 0) return;
		Ih.copy(e.matrixWorld).invert(), Ph.copy(t.ray).applyMatrix4(Ih), Lh.setFromMatrixScale(e.matrixWorld), Fh.copy(Ph.direction).multiply(Lh);
		let i = Fh.length(), a = t.near / i, o = t.far / i;
		if (t.firstHitOnly === !0) {
			let i = this.raycastFirst(Ph, r, a, o);
			i = Mh(i, e, t), i && n.push(i);
		} else {
			let i = this.raycast(Ph, r, a, o);
			for (let r = 0, a = i.length; r < a; r++) {
				let a = Mh(i[r], e, t);
				a && n.push(a);
			}
		}
		return n;
	}
	refit(e = null) {
		return (this.indirect ? uh : Rm)(this, e);
	}
	raycast(e, t = 0, n = 0, r = Infinity) {
		let i = this._roots, a = [], o = this.indirect ? dh : Um;
		for (let s = 0, c = i.length; s < c; s++) o(this, s, t, e, a, n, r);
		return a;
	}
	raycastFirst(e, t = 0, n = 0, r = Infinity) {
		let i = this._roots, a = null, o = this.indirect ? mh : Km;
		for (let s = 0, c = i.length; s < c; s++) {
			let i = o(this, s, t, e, n, r);
			i != null && (a == null || i.distance < a.distance) && (a = i);
		}
		return a;
	}
	intersectsGeometry(e, t) {
		let n = !1, r = this._roots, i = this.indirect ? Sh : eh;
		for (let a = 0, o = r.length; a < o && (n = i(this, a, e, t), !n); a++);
		return n;
	}
	shapecast(e) {
		let t = hm.getPrimitive(), n = super.shapecast({
			...e,
			intersectsPrimitive: e.intersectsTriangle,
			scratchPrimitive: t,
			iterate: this.indirect ? Hm : Lm
		});
		return hm.releasePrimitive(t), n;
	}
	bvhcast(t, n, r) {
		let { intersectsRanges: i, intersectsTriangles: a } = r, o = hm.getPrimitive(), s = this.geometry.index, c = this.geometry.attributes.position, l = this.indirect ? (e) => {
			let t = this.resolveTriangleIndex(e);
			Pm(o, t * 3, s, c);
		} : (e) => {
			Pm(o, e * 3, s, c);
		}, u = hm.getPrimitive(), d = t.geometry.index, f = t.geometry.attributes.position, p = t.indirect ? (e) => {
			let n = t.resolveTriangleIndex(e);
			Pm(u, n * 3, d, f);
		} : (e) => {
			Pm(u, e * 3, d, f);
		};
		if (a) {
			if (!(t instanceof e)) throw Error("MeshBVH: \"intersectsTriangles\" callback can only be used with another MeshBVH.");
			let r = (e, t, r, i, s, c, d, f) => {
				for (let m = r, h = r + i; m < h; m++) {
					p(m), u.a.applyMatrix4(n), u.b.applyMatrix4(n), u.c.applyMatrix4(n), u.needsUpdate = !0;
					for (let n = e, r = e + t; n < r; n++) if (l(n), o.needsUpdate = !0, a(o, u, n, m, s, c, d, f)) return !0;
				}
				return !1;
			};
			if (i) {
				let e = i;
				i = function(t, n, i, a, o, s, c, l) {
					return e(t, n, i, a, o, s, c, l) ? !0 : r(t, n, i, a, o, s, c, l);
				};
			} else i = r;
		}
		return super.bvhcast(t, n, { intersectsRanges: i });
	}
	intersectsBox(e, t) {
		return Nh.set(e.min, e.max, t), Nh.needsUpdate = !0, this.shapecast({
			intersectsBounds: (e) => Nh.intersectsBox(e),
			intersectsTriangle: (e) => Nh.intersectsTriangle(e)
		});
	}
	intersectsSphere(e) {
		return this.shapecast({
			intersectsBounds: (t) => e.intersectsBox(t),
			intersectsTriangle: (t) => t.intersectsSphere(e)
		});
	}
	closestPointToGeometry(e, t, n = {}, r = {}, i = 0, a = Infinity) {
		return (this.indirect ? jh : lh)(this, e, t, n, r, i, a);
	}
	closestPointToPoint(e, t = {}, n = 0, r = Infinity) {
		return vm(this, e, t, n, r);
	}
}, Bh = {
	Mesh: ti.prototype.raycast,
	Line: sa.prototype.raycast,
	LineSegments: da.prototype.raycast,
	LineLoop: fa.prototype.raycast,
	Points: va.prototype.raycast,
	BatchedMesh: Qi.prototype.raycast
}, Vh = /* @__PURE__ */ new ti(), Hh = [];
function Uh(e, t) {
	if (this.isBatchedMesh) Wh.call(this, e, t);
	else {
		let { geometry: n } = this;
		if (n.boundsTree) n.boundsTree.raycastObject3D(this, e, t);
		else {
			let n;
			if (this instanceof ti) n = Bh.Mesh;
			else if (this instanceof da) n = Bh.LineSegments;
			else if (this instanceof fa) n = Bh.LineLoop;
			else if (this instanceof sa) n = Bh.Line;
			else if (this instanceof va) n = Bh.Points;
			else throw Error("BVH: Fallback raycast function not found.");
			n.call(this, e, t);
		}
	}
}
function Wh(e, t) {
	if (this.boundsTrees) {
		let n = this.boundsTrees, r = this._drawInfo || this._instanceInfo, i = this._drawRanges || this._geometryInfo, a = this.matrixWorld;
		Vh.material = this.material, Vh.geometry = this.geometry;
		let o = Vh.geometry.boundsTree, s = Vh.geometry.drawRange;
		Vh.geometry.boundingSphere === null && (Vh.geometry.boundingSphere = new br());
		for (let o = 0, s = r.length; o < s; o++) {
			if (!this.getVisibleAt(o)) continue;
			let s = r[o].geometryIndex;
			if (Vh.geometry.boundsTree = n[s], this.getMatrixAt(o, Vh.matrixWorld).premultiply(a), !Vh.geometry.boundsTree) {
				this.getBoundingBoxAt(s, Vh.geometry.boundingBox), this.getBoundingSphereAt(s, Vh.geometry.boundingSphere);
				let e = i[s];
				Vh.geometry.setDrawRange(e.start, e.count);
			}
			Vh.raycast(e, Hh);
			for (let e = 0, n = Hh.length; e < n; e++) {
				let n = Hh[e];
				n.object = this, n.batchId = o, t.push(n);
			}
			Hh.length = 0;
		}
		Vh.geometry.boundsTree = o, Vh.geometry.drawRange = s, Vh.material = null, Vh.geometry = null;
	} else Bh.BatchedMesh.call(this, e, t);
}
function Gh(e = {}) {
	let { type: t = zh } = e;
	return this.boundsTree = new t(this, e), this.boundsTree;
}
// src/assembly.js
var Kh = (e, t, n) => ({
	label: e,
	offset: t,
	connection: n
}), qh = {
	H01: Kh("Schädelhaube", [
		0,
		.82,
		0
	], "Verdeckte Auflage und Befestigung an H09/H03 konstruieren."),
	H02: Kh("Brauenkante", [
		0,
		.3,
		.68
	], "Übergang zur Augenmaske; getrennte schmale Kante."),
	H03: Kh("Augenmaske", [
		0,
		.02,
		.72
	], "Maskenauflage und lösbare Anschlüsse zum hellen Rahmen."),
	H04A: Kh("Auge A", [
		-.15,
		.05,
		1.12
	], "Leuchteinsatz, Halter und elektrische Durchführung fehlen."),
	H04B: Kh("Auge B", [
		.15,
		.05,
		1.12
	], "Leuchteinsatz, Halter und elektrische Durchführung fehlen."),
	H05A: Kh("Wange A", [
		-.48,
		-.16,
		.73
	], "Fugen und Befestigung zur Augenmaske und zum Kiefer."),
	H05B: Kh("Wange B", [
		.48,
		-.16,
		.73
	], "Fugen und Befestigung zur Augenmaske und zum Kiefer."),
	H06: Kh("Mitteleinsatz / Schienen", [
		0,
		-.42,
		1.05
	], "Einsatz und Schienen sind eigene Meshes; Haltepunkte offen."),
	H07: Kh("Kinnblock", [
		0,
		-.72,
		.72
	], "Seitliche Verbindung zu den Kieferstücken konstruieren."),
	H08A: Kh("Kiefer A", [
		-.5,
		-.55,
		.24
	], "Anschluss an Kinn und Seitenrahmen."),
	H08B: Kh("Kiefer B", [
		.5,
		-.55,
		.24
	], "Anschluss an Kinn und Seitenrahmen."),
	H09: Kh("Seiten- / Heckgehäuse", [
		0,
		0,
		-.65
	], "Träger für Haube, Rahmen und Anbauten; Wandstärken offen."),
	H10: Kh("Nacken- / Seitenrahmen", [
		0,
		-.55,
		-.18
	], "Auflage und Verschraubung des hellen Gehäuses."),
	H11A: Kh("Einlagen A", [
		-.8,
		-.4,
		.12
	], "Einlagen und Taschenböden; Aufnahme im Rahmen konstruieren."),
	H11B: Kh("Einlagen B", [
		.8,
		-.4,
		.12
	], "Einlagen und Taschenböden; Aufnahme im Rahmen konstruieren."),
	H12: Kh("Funkmuschel A", [
		-1.15,
		.08,
		-.05
	], "Gehäuse, Polster und Bedienungen; interne Befestigungen offen."),
	H13: Kh("Funkmuschel B", [
		1.15,
		.08,
		-.05
	], "Spiegelbaugruppe zu A; interne Befestigungen offen."),
	H14A: Kh("Maskenhalter A", [
		-.76,
		.22,
		.38
	], "Gelenk- und Schraubverbindung an der Maske."),
	H14B: Kh("Maskenhalter B", [
		.76,
		.22,
		.38
	], "Gelenk- und Schraubverbindung an der Maske."),
	H15: Kh("Kopfhörerband", [
		0,
		1.35,
		-.08
	], "Band, Mittelstreifen und Klemmen; Verbindung zu Seitenhaltern."),
	H15A: Kh("Kopfhörerhalter A", [
		-1.12,
		.66,
		-.05
	], "Bügelenden, Gelenk und Drahtauflagen ausarbeiten."),
	H15B: Kh("Kopfhörerhalter B", [
		1.12,
		.66,
		-.05
	], "Bügelenden, Gelenk und Drahtauflagen ausarbeiten."),
	H16: Kh("Hinterkopfmodul", [
		0,
		.3,
		-1.24
	], "Montageplatte, Kasten und Steckverbinder; Kabeldurchführungen offen."),
	H17A: Kh("Antenne A", [
		-1.35,
		.65,
		-.33
	], "Antennenfuß mit lösbarem Anschluss."),
	H17B: Kh("Antenne B", [
		1.35,
		.65,
		-.33
	], "Antennenfuß mit lösbarem Anschluss."),
	H18A: Kh("Kabel / Stecker A", [
		-1.1,
		-.58,
		-.14
	], "Kabelenden, Zugentlastung und Halteklammern."),
	H18B: Kh("Kabel / Stecker B", [
		1.1,
		-.58,
		-.14
	], "Kabelenden, Zugentlastung und Halteklammern."),
	H19: Kh("Halsanschluss", [
		0,
		-1.03,
		-.1
	], "Übergang zu flexiblem Hals; Bewegungsfreiraum später prüfen."),
	H20: Kh("Stirn- / Scheitelblende A", [
		-.42,
		.4,
		.35
	], "Dünne separate Schale; verdeckte Auflage und Befestigung offen."),
	H21: Kh("Stirn- / Scheitelblende B", [
		.42,
		.4,
		.35
	], "Dünne separate Schale; verdeckte Auflage und Befestigung offen."),
	F01: Kh("Schraubensatz oben", [
		-.64,
		.55,
		1.13
	], "Visualisierte Köpfe; keine konstruierten Gewinde / Bohrungen."),
	F02: Kh("Schraubensatz Kinn", [
		.55,
		-.92,
		1.02
	], "Visualisierte Köpfe; keine konstruierten Gewinde / Bohrungen."),
	F03: Kh("Schraubensatz Rahmen", [
		-.56,
		-.85,
		-.12
	], "Visualisierte Köpfe; keine konstruierten Gewinde / Bohrungen."),
	P01: Kh("Präsentationshals", [
		0,
		-1.35,
		-.08
	], "Bisheriger Darstellungsunterbau; kein konstruiertes Helmbauteil.")
};
function Jh(e) {
	if (e.userData.partId && (qh[e.userData.partId] || /^[BL]/.test(e.userData.partId))) return e.userData.partId;
	let t = [];
	for (let n = e; n; n = n.parent) t.push(n.name);
	let n = (e) => t.includes(e), r = e.name;
	if (n("BodyStudy")) return "L00";
	if (n("Neck")) return "P01";
	if (n("BackBox_Group")) return "H16";
	if (n("Hinge_R")) return "H14A";
	if (n("Hinge_L")) return "H14B";
	if (n("LeftEar_Cap")) return "H15";
	let i = n("MirroredComms_B");
	if (i || n("RightComms_And_Tube")) {
		let t = i ? "B" : "A";
		return n(i ? "Antenna_B" : "Antenna") ? `H17${t}` : n(i ? "Hose_B" : "Hose") ? `H18${t}` : r.startsWith("Yoke") || e.userData.assemblyRole === "headset-bail" ? `H15${t}` : i ? "H13" : "H12";
	}
	if (/^(CollarSlot|CollarPanel|CollarSocket|Jaw_Insert)/.test(r)) return r.endsWith("_R") ? "H11A" : "H11B";
	if (n("CollarDipPlate")) return "H10";
	let a = {
		Crown: "H01",
		Brim: "H02",
		Shell: "H03",
		Visor_R: "H04A",
		Visor_L: "H04B",
		Cheek_R: "H05A",
		Cheek_L: "H05B",
		Mouth_Insert: "H06",
		MouthRail_R: "H06",
		MouthRail_L: "H06",
		MaskGap: "H06",
		Chin: "H07",
		Jaw_R: "H08A",
		Jaw_L: "H08B",
		Core: "H09",
		RearPanel: "H09",
		Collar: "H10",
		NeckRing: "H19",
		ForeheadPlate_R: "H20",
		ForeheadPlate_L: "H21",
		Screws_Upper: "F01",
		Screws_Chin: "F02",
		Screws_Side: "F03"
	};
	if (a[r]) return a[r];
	throw Error(`Unclassified assembly mesh ${t.reverse().join("/")}`);
}
var Yh = {
	B01: "Flexibler Hals",
	B02: "Halsrippen",
	B03: "Kragen vorne",
	B04: "Kragen hinten",
	B05: "Oberkörperbasis",
	B06: "Schulterbasis A",
	B07: "Schulter vorne A",
	B08: "Schulter hinten A",
	B09: "Schulterbasis B",
	B10: "Schulter vorne B",
	B11: "Schulter hinten B",
	B12: "Brustplatte A",
	B13: "Brustplatte B",
	B14: "Brusteinsatz A",
	B15: "Brusteinsatz B",
	B16: "Rückenplatte A",
	B17: "Rückenplatte B",
	B18: "Rückeneinsatz",
	B19: "Brustbefestigung A",
	B20: "Brustbefestigung B",
	B21: "Rückenbefestigung A",
	B22: "Rückenbefestigung B",
	B23: "Schulterlamelle A",
	B24: "Schulterlamelle B",
	B25: "Schultergelenk A",
	B26: "Schultergelenk B",
	B27: "Brustmitte",
	B28: "Flankenpanzer A",
	B29: "Flankenpanzer B",
	B30: "Schulterdach A",
	B31: "Schulterdach B"
}, Xh = (e) => /^H\d\d[AB]$/.test(e) ? e.slice(0, 3) : e, Zh = (e) => e.replace(/ [AB]$/, ""), Qh = [];
for (let [e, t] of Object.entries(qh)) {
	let n = Xh(e);
	Qh.some((e) => e.id === n) || Qh.push({
		id: n,
		name: n === e ? t.label : Zh(t.label)
	});
}
for (let [e, t] of Object.entries(Yh)) Qh.push({
	id: e,
	name: t
});
Qh.sort((e, t) => e.id.localeCompare(t.id, "de", { numeric: !0 }));
function $h(e) {
	for (let t = e; t; t = t.parent) try {
		let e = Jh(t);
		if (e === "L00") continue;
		return Qh.find((t) => t.id === Xh(e)) || {
			id: e,
			name: e
		};
	} catch {}
	return null;
}
function eg(e) {
	return e.x < -.03 ? "A" : e.x > .03 ? "B" : "Mitte";
}
var tg = [
	"Oberkante",
	"Unterkante",
	"Vorderkante",
	"Hinterkante",
	"Ecke",
	"Fläche außen",
	"Boden",
	"Fuge / Spalt",
	"Übergang zum Nachbarteil",
	"ganzes Teil"
], ng = [
	"vorn",
	"hinten",
	"oben",
	"unten",
	"außen",
	"innen",
	"schmaler",
	"breiter",
	"höher",
	"flacher",
	"runder",
	"kantiger",
	"schließen",
	"entfernen",
	"hinzufügen"
], rg = [
	"ein wenig",
	"deutlich",
	"bündig mit Nachbarteil",
	"in cm"
];
Or.prototype.computeBoundsTree = Gh, ti.prototype.raycast = Uh;
var ig = (e) => document.getElementById(e), ag = (e) => Math.round(e * 1e4) / 1e4, og = (e) => Math.round(e * 1e3) / 1e3, sg = (e, t = ag) => [
	t(e.x),
	t(e.y),
	t(e.z)
], cg = ig("stage"), lg = new hd({
	antialias: !0,
	alpha: !0,
	preserveDrawingBuffer: !0
});
lg.setPixelRatio(Math.min(devicePixelRatio, 2)), lg.toneMapping = 4, lg.setClearColor(0, 0), cg.prepend(lg.domElement);
var ug = new Pn(), dg = new Hf();
for (let [e, t, n] of [
	[
		[
			-3,
			3,
			4
		],
		[4, 3],
		5
	],
	[
		[
			4,
			1,
			3
		],
		[3, 3],
		2
	],
	[
		[
			0,
			3,
			-4
		],
		[5, 2],
		4
	]
]) {
	let r = new ti(new Qa(...t), new Ur({ color: new J(n, n, n) }));
	r.position.set(...e), r.lookAt(0, 0, 0), dg.add(r);
}
ug.environment = new Sc(lg).fromScene(dg, .02).texture, ug.environmentIntensity = .3;
var fg = new En(), pg = new _s(16777215, 1.1);
pg.position.set(-2.5, 3.5, 3);
var mg = new _s(14673663, .35);
mg.position.set(3, 1, 2);
var hg = new _s(16777215, .7);
hg.position.set(.5, 2.5, -3.5), fg.add(pg, mg, hg), ug.add(fg, new Qo(16777215, 4473924, .25));
var gg = new us(30, 1, .05, 80), _g = new W(0, 0, 0), vg = new W(.55, .68, .55), yg = new Ed(gg, lg.domElement);
yg.enableDamping = !0, yg.minDistance = .6, yg.maxDistance = 5, yg.target.copy(_g);
var bg = [
	["Vorn", 0],
	["¾ A", -40],
	["Seite A", -90],
	["Hinten", 180],
	["Seite B", 90],
	["¾ B", 40]
];
function xg() {
	let e = Math.tan(kt.degToRad(gg.fov / 2)), t = Math.max(vg.x, vg.z);
	return (Math.max(vg.y / e, t / (e * gg.aspect)) + t) * (gg.aspect < .9 ? 1.2 : 1.12);
}
function Sg(e, t = 4, n = xg()) {
	let r = kt.degToRad(e), i = kt.degToRad(t);
	return {
		pos: new W(Math.sin(r) * Math.cos(i), Math.sin(i), Math.cos(r) * Math.cos(i)).multiplyScalar(n).add(_g),
		ziel: _g.clone()
	};
}
var Cg = !1, wg = new En(), Tg = new En();
ug.add(wg, Tg);
var Eg = [], Dg = new Rs();
Dg.firstHitOnly = !0;
var Og = !0, kg = null, Ag = () => {
	Og = !0;
};
yg.addEventListener("change", Ag);
function jg() {
	let { width: e, height: t } = cg.getBoundingClientRect();
	e && t && (lg.setSize(e, t, !1), gg.aspect = e / t, gg.updateProjectionMatrix(), Cg || (Cg = !0, gg.position.copy(Sg(-25).pos)), Ag());
}
new ResizeObserver(jg).observe(cg);
function Mg(e) {
	if (requestAnimationFrame(Mg), kg) {
		let t = Math.min(1, (e - kg.t0) / 450), n = t * t * (3 - 2 * t);
		gg.position.lerpVectors(kg.from.pos, kg.to.pos, n), yg.target.lerpVectors(kg.from.ziel, kg.to.ziel, n), t === 1 && (kg = null), Og = !0;
	}
	if (yg.update() || Og) {
		Og = !1;
		let e = gg.position.clone().sub(yg.target);
		fg.rotation.y = Math.atan2(e.x, e.z), ug.environmentRotation.set(0, fg.rotation.y, 0), lg.render(ug, gg), qg();
	}
}
function Ng(e) {
	kg = {
		t0: performance.now(),
		from: {
			pos: gg.position.clone(),
			ziel: yg.target.clone()
		},
		to: e
	};
}
function Pg(e, t) {
	let n = lg.domElement.getBoundingClientRect(), r = new U((e - n.left) / n.width * 2 - 1, -((t - n.top) / n.height) * 2 + 1);
	Dg.setFromCamera(r, gg);
	let i = Dg.intersectObjects(Eg, !1)[0];
	if (!i) return null;
	let a = i.face ? i.face.normal.clone().transformDirection(i.object.matrixWorld) : new W(0, 0, 1);
	return a.dot(Dg.ray.direction) > 0 && a.negate(), {
		object: i.object,
		point: i.point.clone(),
		normal: a
	};
}
var Q = {
	config: null,
	markers: [],
	draft: null,
	selected: null,
	mode: "nadel",
	showDone: !0,
	canWrite: !0,
	confirmDelete: null
}, Fg = {
	kind: "lokal",
	db: null,
	local() {
		try {
			return JSON.parse(localStorage.getItem("critic-marker") || "[]");
		} catch {
			return [];
		}
	},
	saveLocal(e) {
		try {
			localStorage.setItem("critic-marker", JSON.stringify(e));
		} catch {}
		Q.markers = e, s_();
	},
	async add(e) {
		if (this.db) return this.db.collection("marker").add(e);
		this.saveLocal([...Q.markers, {
			id: `lokal-${Date.now().toString(36)}`,
			...e
		}]);
	},
	async update(e, t) {
		if (this.db) return this.db.doc(`marker/${e}`).update(t);
		this.saveLocal(Q.markers.map((n) => n.id === e ? {
			...n,
			...t
		} : n));
	},
	async remove(e) {
		if (this.db) return this.db.doc(`marker/${e}`).delete();
		this.saveLocal(Q.markers.filter((t) => t.id !== e));
	}
};
async function Ig() {
	Q.markers = Fg.local(), Lg("Lokaler Modus: Marker bleiben nur in diesem Browser."), s_();
	let e = window.claude;
	if (!e?.use) return;
	let [t, n] = await Promise.all([e.use("db"), e.use("user")]);
	t ? (Fg.db = t, Fg.kind = "db", Q.markers = [], Q.canWrite = (n ? await n.can("data.write") : null) !== !1, Lg(Q.canWrite ? "" : "Nur ansehen: du kannst hier keine Marker setzen."), t.collection("marker").onSnapshot((e) => {
		Q.markers = e.docs.map((e) => ({
			id: e.id,
			...e.data()
		})), s_();
	}, () => Lg("Verbindung zum Speicher unterbrochen. Seite neu laden."))) : Lg("Kein gemeinsamer Speicher in dieser Ansicht: Marker bleiben nur in diesem Browser.");
}
function Lg(e) {
	ig("store-note").textContent = e, ig("store-note").hidden = !e;
}
function Rg(e) {
	let t = Qh.find((t) => t.id === e);
	return t ? `${t.id} ${t.name}` : "Teil unklar";
}
function zg(e) {
	let t = e.betrag === "in cm" && e.cm != null && e.cm !== "" ? `${e.cm} cm` : e.betrag, n = [
		e.seite && e.seite !== "Mitte" ? e.seite === "beide" ? "beide Seiten" : `Seite ${e.seite}` : "",
		e.stelle,
		(e.richtung || []).join(", "),
		t
	].filter(Boolean);
	return `${Rg(e.teil)}${n.length ? " · " + n.join(" · ") : ""}${e.notiz ? " – " + e.notiz : ""}`;
}
var Bg = (e) => Q.config && e.stand !== Q.config.stand, Vg = () => Q.markers.filter((e) => Q.showDone || e.status !== "umgesetzt").sort((e, t) => (e.nr || 0) - (t.nr || 0));
function Hg(e, t) {
	let n = e.map((e) => new W(...e));
	return n.length < 2 ? null : new ti(new $a(new Pa(n, !1, "centripetal"), Math.min(400, n.length * 3), .0028, 6, !1), new Ur({
		color: t,
		toneMapped: !1
	}));
}
function Ug(e) {
	return new J(getComputedStyle(document.documentElement).getPropertyValue(e).trim() || "#e8962a");
}
function Wg() {
	for (let e of [...Tg.children]) Tg.remove(e), e.geometry.dispose(), e.material.dispose();
	for (let e of Vg()) {
		if (!e.strich) continue;
		let t = Bg(e) ? Ug("--old") : e.status === "umgesetzt" ? Ug("--done") : Ug("--accent"), n = Hg(e.strich, t);
		n && Tg.add(n);
	}
	if (Q.draft?.strich) {
		let e = Hg(Q.draft.strich, Ug("--draft"));
		e && Tg.add(e);
	}
	Ag();
}
var Gg = ig("pins");
function Kg(e) {
	let t = Gg.querySelector(`[data-key="${e}"]`);
	return t || (t = document.createElement("button"), t.type = "button", t.className = "pin", t.dataset.key = e, t.addEventListener("click", () => e === "draft" ? ig("f-notiz")?.focus() : Xg(e, !0)), Gg.append(t)), t;
}
function qg() {
	let e = lg.domElement.getBoundingClientRect(), t = Vg().map((e) => ({
		key: e.id,
		m: e
	}));
	Q.draft?.punkt && !Q.draft.editId && t.push({
		key: "draft",
		m: Q.draft
	});
	let n = new Set(t.map((e) => e.key));
	for (let e of [...Gg.children]) n.has(e.dataset.key) || e.remove();
	let r = new Rs();
	r.firstHitOnly = !0;
	for (let { key: n, m: i } of t) {
		let t = new W(...i.punkt).addScaledVector(new W(...i.normale || [
			0,
			0,
			0
		]), .004), a = t.clone().project(gg), o = Kg(n);
		o.textContent = n === "draft" ? "+" : String(i.nr ?? "?"), o.className = "pin" + (n === "draft" ? " draft" : "") + (i.status === "umgesetzt" ? " done" : "") + (n !== "draft" && Bg(i) ? " old" : "") + (Q.selected === n ? " sel" : "");
		let s = gg.position.distanceTo(t);
		r.set(gg.position, t.clone().sub(gg.position).normalize()), r.far = s;
		let c = r.intersectObjects(Eg, !1).some((e) => e.distance < s - .012);
		o.classList.toggle("behind", c), o.style.display = a.z > 1 ? "none" : "", o.style.left = `${(a.x + 1) / 2 * e.width}px`, o.style.top = `${(1 - a.y) / 2 * e.height}px`, o.setAttribute("aria-label", n === "draft" ? "Neuer Marker" : `Marker ${i.nr}`);
	}
}
function Jg() {
	return {
		pos: sg(gg.position, og),
		ziel: sg(yg.target, og)
	};
}
function Yg(e, t, n = null) {
	let r = $h(e.object);
	Q.draft = {
		art: t,
		punkt: sg(e.point),
		normale: sg(e.normal, og),
		strich: n,
		kamera: Jg(),
		vorschlag: r ? `${r.id} ${r.name}` : "",
		mesh: e.object.name || e.object.parent?.name || "",
		teil: r?.id || "?",
		seite: eg(e.point),
		stelle: "",
		richtung: [],
		betrag: "",
		cm: null,
		notiz: ""
	}, Q.selected = null, Wg(), s_(), ig("f-notiz")?.focus({ preventScroll: !0 });
}
function Xg(e, t) {
	Q.selected = Q.selected === e && !t ? null : e, Q.confirmDelete = null;
	let n = Q.markers.find((t) => t.id === e);
	n && t && n.kamera && Ng({
		pos: new W(...n.kamera.pos),
		ziel: new W(...n.kamera.ziel)
	}), s_(), document.querySelector(`[data-item="${CSS.escape(e)}"]`)?.scrollIntoView({
		block: "nearest",
		behavior: "smooth"
	});
}
var Zg = lg.domElement, Qg = null, $g = null;
Zg.addEventListener("pointerdown", (e) => {
	if (Qg = {
		x: e.clientX,
		y: e.clientY,
		t: performance.now()
	}, Q.mode !== "stift" || !Q.canWrite) return;
	let t = Pg(e.clientX, e.clientY);
	t && (Zg.setPointerCapture(e.pointerId), $g = {
		first: t,
		pts: [t.point.clone().addScaledVector(t.normal, .002)]
	}, Q.draft = null, e.preventDefault());
}), Zg.addEventListener("pointermove", (e) => {
	if (!$g) return;
	let t = Pg(e.clientX, e.clientY);
	if (!t) return;
	let n = t.point.clone().addScaledVector(t.normal, .002);
	n.distanceTo($g.pts[$g.pts.length - 1]) < .004 || ($g.pts.push(n), $g.pts.length > 600 && ($g.pts = $g.pts.filter((e, t) => t % 2 == 0)), Q.draft = { strich: $g.pts.map((e) => sg(e)) }, Wg());
}), Zg.addEventListener("pointerup", (e) => {
	if ($g) {
		let e = $g;
		$g = null, e.pts.length >= 2 ? Yg(e.first, "strich", e.pts.map((e) => sg(e))) : Yg(e.first, "nadel");
		return;
	}
	if (!Qg || Q.mode !== "nadel" || !Q.canWrite || Math.hypot(e.clientX - Qg.x, e.clientY - Qg.y) > 6 || performance.now() - Qg.t > 600) return;
	let t = Pg(e.clientX, e.clientY);
	t && Yg(t, "nadel");
});
function e_(e) {
	Q.mode = e, yg.enabled = e === "nadel", cg.dataset.mode = e;
	for (let t of document.querySelectorAll("[data-mode]")) t.setAttribute("aria-pressed", String(t.dataset.mode === e));
	ig("hint").textContent = e === "stift" ? "Auf den Helm zeichnen: eine Linie für eine Kante, ein Kreis um einen Bereich. Zum Drehen zurück auf „Nadel“." : "Antippen setzt eine Nadel · Ziehen dreht · Scrollen oder zwei Finger zoomen";
}
function $(e, t = {}, ...n) {
	let r = document.createElement(e);
	for (let [e, n] of Object.entries(t)) e === "class" ? r.className = n : e.startsWith("on") ? r.addEventListener(e.slice(2), n) : n === !0 ? r.setAttribute(e, "") : n !== !1 && n != null && r.setAttribute(e, n);
	for (let e of n.flat()) e != null && e !== !1 && r.append(e instanceof Node ? e : document.createTextNode(String(e)));
	return r;
}
function t_(e, t, n, r) {
	return $("label", {
		class: "field",
		for: e
	}, $("span", {}, t), $("select", {
		id: e,
		onchange: (t) => Q.draft[e.slice(2)] = t.target.value
	}, r.map(([e, t]) => $("option", {
		value: e,
		selected: e === n
	}, t))));
}
function n_() {
	let e = ig("form");
	e.replaceChildren();
	let t = Q.draft;
	if (e.hidden = !t || !t.art, e.hidden) return;
	let n = t.editId ? `Marker ${Q.markers.find((e) => e.id === t.editId)?.nr} bearbeiten` : t.art === "strich" ? "Neuer Strich" : "Neue Nadel";
	e.append($("div", { class: "form-head" }, $("h2", {}, n), $("span", { class: "mono" }, `Vorschlag: ${t.vorschlag || "–"}`)), $("div", { class: "grid2" }, t_("f-teil", "Teil", t.teil, [["?", "? unklar"], ...Qh.map((e) => [e.id, `${e.id} ${e.name}`])]), t_("f-seite", "Seite", t.seite, [
		["A", "A – im Frontbild links"],
		["B", "B – im Frontbild rechts"],
		["beide", "beide"],
		["Mitte", "Mitte"]
	])), $("div", { class: "grid2" }, t_("f-stelle", "Stelle", t.stelle, [["", "–"], ...tg.map((e) => [e, e])]), t_("f-betrag", "Betrag", t.betrag, [["", "–"], ...rg.map((e) => [e, e])])));
	let r = $("label", {
		class: "field",
		for: "f-cm"
	}, $("span", {}, "cm"), $("input", {
		id: "f-cm",
		type: "number",
		step: "0.1",
		inputmode: "decimal",
		value: t.cm ?? "",
		oninput: (e) => t.cm = e.target.value === "" ? null : Number(e.target.value)
	}));
	r.hidden = t.betrag !== "in cm", e.querySelector("#f-betrag").addEventListener("change", () => r.hidden = t.betrag !== "in cm"), e.append(r, $("fieldset", { class: "chips" }, $("legend", {}, "Richtung"), ng.map((e) => $("button", {
		type: "button",
		class: "chip",
		"aria-pressed": String(t.richtung.includes(e)),
		onclick: (n) => {
			t.richtung = t.richtung.includes(e) ? t.richtung.filter((t) => t !== e) : [...t.richtung, e], n.currentTarget.setAttribute("aria-pressed", String(t.richtung.includes(e)));
		}
	}, e))), $("label", {
		class: "field",
		for: "f-notiz"
	}, $("span", {}, "Notiz (hat Vorrang vor den Feldern)"), $("textarea", {
		id: "f-notiz",
		rows: "3",
		placeholder: "z. B. Lücke zur Haube schließen – gilt auch für die andere Seite",
		oninput: (e) => t.notiz = e.target.value
	}, t.notiz)), $("p", {
		id: "form-error",
		class: "error",
		hidden: !0
	}), $("div", { class: "actions" }, $("button", {
		type: "button",
		class: "primary",
		id: "f-save",
		onclick: r_
	}, t.editId ? "Änderung speichern" : "Marker speichern"), $("button", {
		type: "button",
		id: "f-cancel",
		onclick: () => {
			Q.draft = null, Wg(), s_();
		}
	}, "Verwerfen")));
}
async function r_() {
	let e = Q.draft, t = ig("f-save");
	t.disabled = !0;
	let n = {
		teil: e.teil,
		seite: e.seite,
		stelle: e.stelle,
		richtung: e.richtung,
		betrag: e.betrag,
		cm: e.betrag === "in cm" ? e.cm : null,
		notiz: e.notiz.trim()
	};
	n.satz = zg(n);
	try {
		if (e.editId) await Fg.update(e.editId, n);
		else {
			let t = Q.markers.reduce((e, t) => Math.max(e, t.nr || 0), 0) + 1;
			await Fg.add({
				nr: t,
				stand: Q.config.stand,
				art: e.art,
				punkt: e.punkt,
				normale: e.normale,
				strich: e.strich,
				kamera: e.kamera,
				vorschlag: e.vorschlag,
				mesh: e.mesh,
				...n,
				status: "offen",
				antwort: "",
				erstellt: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
		Q.draft = null, Wg(), s_();
	} catch (e) {
		t.disabled = !1;
		let n = ig("form-error");
		n.hidden = !1, n.textContent = e?.code === "quota_exceeded" ? "Speicher voll: bitte alte Marker löschen." : "Speichern ging nicht. Prüfe die Verbindung und versuche es noch einmal.";
	}
}
function i_() {
	let e = ig("list"), t = Vg(), n = Q.markers.filter((e) => e.status !== "umgesetzt").length;
	if (ig("count").textContent = `${n} offen · ${Q.markers.length - n} umgesetzt`, e.replaceChildren(), !t.length) e.append($("li", { class: "empty" }, Q.markers.length ? "Alle Marker sind umgesetzt." : "Noch keine Marker. Tippe auf den Helm, um eine Nadel zu setzen, oder zeichne im Stift-Modus eine Linie."));
	else for (let n of t) {
		let t = Q.selected === n.id, r = n.status === "umgesetzt" ? "umgesetzt" : "offen", i = $("li", {
			class: `item${t ? " sel" : ""}`,
			"data-item": n.id
		}, $("button", {
			type: "button",
			class: "item-main",
			onclick: () => Xg(n.id, !0)
		}, $("span", { class: `badge ${r}${Bg(n) ? " old" : ""}` }, n.nr ?? "?"), $("span", { class: "item-text" }, $("span", { class: "satz" }, n.satz || zg(n)), $("span", { class: "meta mono" }, [
			n.stand,
			n.art === "strich" ? "Strich" : "Nadel",
			r
		].join(" · ")))), n.antwort ? $("p", { class: "antwort" }, $("strong", {}, "Antwort: "), n.antwort) : null, Bg(n) ? $("p", { class: "note" }, `Gesetzt an Stand ${n.stand}; das Modell hat sich seitdem geändert.`) : null);
		if (t && Q.canWrite && n.status !== "umgesetzt") {
			let e = Q.confirmDelete === n.id;
			i.append($("div", { class: "actions small" }, $("button", {
				type: "button",
				onclick: () => a_(n)
			}, "Bearbeiten"), $("button", {
				type: "button",
				class: e ? "danger" : "",
				onclick: () => o_(n)
			}, e ? "Wirklich löschen" : "Löschen")));
		}
		e.append(i);
	}
}
function a_(e) {
	Q.draft = {
		...e,
		richtung: [...e.richtung || []],
		editId: e.id,
		notiz: e.notiz || ""
	}, s_(), ig("form").scrollIntoView({
		block: "start",
		behavior: "smooth"
	});
}
async function o_(e) {
	Q.confirmDelete === e.id ? (Q.confirmDelete = null, Q.selected = null, await Fg.remove(e.id).catch(() => Lg("Löschen ging nicht. Versuche es noch einmal."))) : (Q.confirmDelete = e.id, i_());
}
function s_() {
	n_(), i_(), Wg(), Ag();
}
function c_() {
	ig("views").append(...bg.map(([e, t]) => $("button", {
		type: "button",
		onclick: () => Ng(Sg(t))
	}, e)));
	for (let e of document.querySelectorAll("[data-mode]")) e.addEventListener("click", () => e_(e.dataset.mode));
	ig("show-done").addEventListener("change", (e) => {
		Q.showDone = e.target.checked, s_();
	}), ig("ref-toggle").addEventListener("click", (e) => {
		let t = ig("refs");
		t.hidden = !t.hidden, e.currentTarget.setAttribute("aria-pressed", String(!t.hidden));
	}), e_("nadel");
}
async function l_(e) {
	let t = await new Hd().loadAsync(e, (e) => {
		e.total && (ig("loading").textContent = `Helm wird geladen … ${Math.round(e.loaded / e.total * 100)} %`);
	});
	wg.add(t.scene), t.scene.traverse((e) => {
		e.isMesh && (e.geometry.computeBoundsTree(), Eg.push(e));
	}), wg.updateMatrixWorld(!0);
	let n = new Yn().setFromObject(wg);
	n.getCenter(_g), n.getSize(vg).multiplyScalar(.5), yg.target.copy(_g), yg.maxDistance = xg() * 2.5, gg.position.copy(Sg(-25).pos), Ag();
}
async function u_() {
	c_(), Ig();
	try {
		Q.config = await (await fetch("stand.json")).json(), ig("stand").textContent = `Stand ${Q.config.stand}`, ig("refs").append(...(Q.config.vorlagen || []).map((e) => $("figure", {}, $("img", {
			src: e.datei,
			alt: `Vorlage ${e.ansicht}`
		}), $("figcaption", {}, e.ansicht)))), await l_(Q.config.modell), ig("loading").hidden = !0, cg.classList.add("ready"), window.__markerReady = !0, window.markerApi = { show(e, t = 0) {
			let n = Q.markers.find((t) => t.id === e);
			if (!n?.kamera) return !1;
			let r = new W(...n.punkt);
			return gg.position.set(...n.kamera.pos).lerp(r, t), yg.target.set(...n.kamera.ziel).lerp(r, t), yg.update(), Q.selected = e, s_(), !0;
		} };
	} catch (e) {
		ig("loading").textContent = "Der Helm konnte nicht geladen werden. Seite neu laden.", console.error(e);
	}
	s_(), requestAnimationFrame(Mg);
}
u_();
