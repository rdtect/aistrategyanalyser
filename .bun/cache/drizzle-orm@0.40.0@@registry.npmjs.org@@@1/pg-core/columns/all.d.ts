import { bigint } from "./bigint.js";
import { bigserial } from "./bigserial.js";
import { boolean } from "./boolean.js";
import { char } from "./char.js";
import { cidr } from "./cidr.js";
import { customType } from "./custom.js";
import { date } from "./date.js";
import { doublePrecision } from "./double-precision.js";
import { inet } from "./inet.js";
import { integer } from "./integer.js";
import { interval } from "./interval.js";
import { json } from "./json.js";
import { jsonb } from "./jsonb.js";
import { line } from "./line.js";
import { macaddr } from "./macaddr.js";
import { macaddr8 } from "./macaddr8.js";
import { numeric } from "./numeric.js";
import { point } from "./point.js";
import { geometry } from "./postgis_extension/geometry.js";
import { real } from "./real.js";
import { serial } from "./serial.js";
import { smallint } from "./smallint.js";
import { smallserial } from "./smallserial.js";
import { text } from "./text.js";
import { time } from "./time.js";
import { timestamp } from "./timestamp.js";
import { uuid } from "./uuid.js";
import { varchar } from "./varchar.js";
import { bit } from "./vector_extension/bit.js";
import { halfvec } from "./vector_extension/halfvec.js";
import { sparsevec } from "./vector_extension/sparsevec.js";
import { vector } from "./vector_extension/vector.js";
export declare function getPgColumnBuilders(): {
    bigint: typeof bigint;
    bigserial: typeof bigserial;
    boolean: typeof boolean;
    char: typeof char;
    cidr: typeof cidr;
    customType: typeof customType;
    date: typeof date;
    doublePrecision: typeof doublePrecision;
    inet: typeof inet;
    integer: typeof integer;
    interval: typeof interval;
    json: typeof json;
    jsonb: typeof jsonb;
    line: typeof line;
    macaddr: typeof macaddr;
    macaddr8: typeof macaddr8;
    numeric: typeof numeric;
    point: typeof point;
    geometry: typeof geometry;
    real: typeof real;
    serial: typeof serial;
    smallint: typeof smallint;
    smallserial: typeof smallserial;
    text: typeof text;
    time: typeof time;
    timestamp: typeof timestamp;
    uuid: typeof uuid;
    varchar: typeof varchar;
    bit: typeof bit;
    halfvec: typeof halfvec;
    sparsevec: typeof sparsevec;
    vector: typeof vector;
};
export type PgColumnsBuilders = ReturnType<typeof getPgColumnBuilders>;
