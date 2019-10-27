/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-24 17:47:11 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-27 19:17:25
 */


const linearGradient: (colorset: Array< string | number >, direction?: 'bottom' | 'top' | 'left' | 'right') => string
    = (colorset: Array< string | number >, direction: 'bottom' | 'top' | 'left' | 'right' = 'bottom') => {
        let steps: Array< [string, number] > = [];
        colorset.forEach((value: string | number) => {
            if (typeof(value) === "number") {
                if (steps.length > 0) {
                    steps[steps.length - 1][1] = value;
                }
            }
            else {
                steps.push([value, -1]);
            }
        });
        if (steps.length === 0) {
            return 'none';
        }
        if (steps.length === 1) {
            return steps[0][0];
        }
        return `linear-gradient(to ${ direction }, ${
            steps.map((value: [string, number], index: number) => {
                if (index === 0) {
                    return value[0];
                }
                else if (index === steps.length - 1) {
                    return ' ' + value[0];
                }
                else if (value[1] === -1) {
                    return ' ' + value[0];
                }
                else {
                    return ' ' + value[0] + ' ' + value[1] + '%';
                }
            })
        })`;
    };


/**
 * Translates color code or rgb(a) to hsl(a)
 * @param {string} color code input
 */
const toHsl: (color: string) => { code: string; h: number; s: number; l: number; a: number; }
    = (color: string) => {
        let h: number = 0;
        let s: number = 0;
        let l: number = 0;
        let a: number = 1;
        if (color.startsWith('#')) {
            let r: number = 0;
            let g: number = 0;
            let b: number = 0;
            if (color.length === 4) {
                r = 255 * parseInt(color[1], 16) / 16;
                g = 255 * parseInt(color[2], 16) / 16;
                b = 255 * parseInt(color[3], 16) / 16;
                color = `rgb(${ r },${ g },${ b })`;
            }
            else if (color.length === 5) {
                r = 255 * parseInt(color[1], 16) / 16;
                g = 255 * parseInt(color[2], 16) / 16;
                b = 255 * parseInt(color[3], 16) / 16;
                let alpha = 255 * parseInt(color[4], 16);
                color = `rgba(${ r },${ g },${ b },${ alpha })`;
            }
            else if (color.length === 7) {
                r = parseInt(color[1], 16);
                g = parseInt(color[2], 16);
                b = parseInt(color[3], 16);
                color = `rgb(${ r },${ g },${ b })`;
            }
            else if (color.length === 9) {
                r = parseInt(color[1], 16);
                g = parseInt(color[2], 16);
                b = parseInt(color[3], 16);
                let alpha = 255 * parseInt(color[4], 256);
                color = `rgba(${ r },${ g },${ b },${ alpha })`;
            }
        }
        if (color.startsWith('rgb(')) {
            let r: number = 0;
            let g: number = 0;
            let b: number = 0;
            const paths: [ string, string, string ]
                = color.substring(color.indexOf('(') + 1, color.indexOf(')')).split(',') as [string, string, string ];
            r = parseFloat(paths[0]) / 255;
            g = parseFloat(paths[1]) / 255;
            b = parseFloat(paths[2]) / 255;
            let max: number = Math.max(r, g, b);
            let min: number = Math.min(r, g, b);
            h = max === min
                ? 0
                : r === max
                    ? g >= b
                        ? 60 * (g - b) / (max - min)
                        : 60 * (g - b) / (max - min) + 360
                    : g === max
                        ? 60 * (b - r) / (max - min) + 120
                        : 60 * (r - g) / (max - min) + 240;
            l = (max + min) / 2;
            s = l === 0 || max === min ? 0
                : l <= 1 / 2
                    ? (max - min) / (max + min)
                    : (max - min) / (2 - max - min);
            return { code: `hsl(${ h },${ s },${ l })`, h: h, s: s, l: l, a: 1 };
        }
        else if (color.startsWith('rgba(')) {
            let r: number = 0;
            let g: number = 0;
            let b: number = 0;
            const paths: [ string, string, string, string ]
                = color.substring(color.indexOf('(') + 1, color.indexOf(')')).split(',') as [string, string, string, string ];
            r = parseFloat(paths[0]) / 255;
            g = parseFloat(paths[1]) / 255;
            b = parseFloat(paths[2]) / 255;
            a = parseFloat(paths[3]);
            let max: number = Math.max(r, g, b);
            let min: number = Math.min(r, g, b);
            h = max === min
                ? 0
                : r === max
                    ? g >= b
                        ? 60 * (g - b) / (max - min)
                        : 60 * (g - b) / (max - min) + 360
                    : g === max
                        ? 60 * (b - r) / (max - min) + 120
                        : 60 * (r - g) / (max - min) + 240;
            l = (max + min) / 2;
            s = l === 0 || max === min ? 0
                : l <= 1 / 2
                    ? (max - min) / (max + min)
                    : (max - min) / (2 - max - min);
            return { code: `hsla(${ h },${ s },${ l },${ a })`, h: h, s: s, l: l, a: a };
        }
        return { code: 'none', h: h, s: s, l: l, a: a };
    };


const toRgb: (hsl: string) => string
    = (hsl: string) => {
        let params: Array<string> = hsl.substring(hsl.indexOf('(') + 1, hsl.indexOf(')')).split(',');
        if (params.length === 3 || params.length === 4) {
            let h: number = parseFloat(params[0]);
            let s: number = parseFloat(params[1]);
            let l: number = parseFloat(params[2]);
            let q: number = l < 1 / 2 ? l * (1 + s) : l + s - (l * s);
            let p: number = 2 * l - q;
            let h_k: number = h / 360;
            let t_r: number = h_k + 1 / 3;
            t_r = t_r > 1 ? t_r - 1 : t_r < 0 ? t_r + 1 : t_r;
            let t_g: number = h_k;
            t_g = t_g > 1 ? t_g - 1 : t_g < 0 ? t_g + 1 : t_g;
            let t_b: number = h_k - 1 / 3;
            t_b = t_b > 1 ? t_b - 1 : t_b < 0 ? t_b + 1 : t_b;

            let r: number = t_r < 1 / 6
                ? p + (q - p) * 6 * t_r
                : t_r < 1 / 2
                    ? q
                    : t_r < 2 / 3
                        ? p + (q - p) * 6 * (2 / 3 - t_r)
                        : p;
            let g: number = t_g < 1 / 6
                ? p + (q - p) * 6 * t_g
                : t_g < 1 / 2
                    ? q
                    : t_g < 2 / 3
                        ? p + (q - p) * 6 * (2 / 3 - t_g)
                        : p;
            let b: number = t_b < 1 / 6
                ? p + (q - p) * 6 * t_b
                : t_b < 1 / 2
                    ? q
                    : t_b < 2 / 3
                        ? p + (q - p) * 6 * (2 / 3 - t_b)
                        : p;

            if (params.length === 4) {
                return `rgba(${ r * 255 },${ g * 255 },${ b * 255 },${ params[3] })`;
            }
            return `rgb(${ r * 255 },${ g * 255 },${ b * 255 })`;
        }
        return 'none';
    };


/**
 * Sets lightness of a color.
 * @param {string} color
 * @param {number} degree
 * @returns
 */
const setLightness: (color: string, degree: number) => string
    = (color: string, degree: number) => {
        const { h, s, a } = toHsl(color);
        let hsl: string = a === 1 ? `hsl(${ h },${ s },${ degree })` : `hsla(${ h },${ s },${ degree },${ a })`;
        return toRgb(hsl);
    };
    

/**
 * Color: namespace
 */
const Color = {
    /**
     * Creates a linear gradient.
     */
    linearGradient: linearGradient,

    /**
     * Translates a color code to hsl(a).
     */
    toHsl: toHsl,
    
    /**
     * Translates a hsl(a) code to rgb(a).
     */
    toRgb: toRgb,

    /**
     * Sets lightness of a color.
     */
    setLightness: setLightness,

    /**
     * Colorset Nippon
     * Traditional Japanese colors.
     */
    Nippon: {
        /**
         ```
         撫子 rgb(220,159,180)
         ```
         */
        Nadesiko: '#DC9FB4',
        /**
         ```
         紅梅 rgb(225,107,140)
         ```
         */
        Koubai: '#E16B8C',
        /**
         ```
         蘇芳 rgb(142,53,74)
         ```
         */
        Suou: '#8E354A',
        /**
         ```
         退紅 rgb(248,195,205)
         ```
         */
        Taikou: '#F8C3CD',
        /**
         ```
         一斥染 rgb(244,167,185)
         ```
         */
        Ikkonzome: '#F4A7B9',
        /**
         ```
         桑染 rgb(100,54,60)
         ```
         */
        Kuwazome: '#64363C',
        /**
         ```
         桃 rgb(245,150,170)
         ```
         */
        Momo: '#F596AA',
        /**
         ```
         苺 rgb(181,73,91)
         ```
         */
        Ichigo: '#B5495B',
        /**
         ```
         薄紅 rgb(232,122,144)
         ```
         */
        Usubeni: '#E87A90',
        /**
         ```
         今様 rgb(208,90,110)
         ```
         */
        Imayou: '#D05A6E',
        /**
         ```
         中紅 rgb(219,77,109)
         ```
         */
        Nakabeni: '#DB4D6D',
        /**
         ```
         桜 rgb(254,223,225)
         ```
         */
        Sakura: '#FEDFE1',
        /**
         ```
         梅鼠 rgb(158,122,122)
         ```
         */
        Umenezumi: '#9E7A7A',
        /**
         ```
         韓紅花 rgb(208,16,76)
         ```
         */
        Karakurenai: '#D0104C',
        /**
         ```
         燕脂 rgb(159,53,58)
         ```
         */
        Enzi: '#9F353A',
        /**
         ```
         紅 rgb(203,27,69)
         ```
         */
        Kurenai: '#CB1B45',
        /**
         ```
         鴇 rgb(238,269,269)
         ```
         */
        Toki: '#EEA9A9',
        /**
         ```
         長春 rgb(191,103,102)
         ```
         */
        Tyousyunn: '#BF6766',
        /**
         ```
         深緋 rgb(134,71,63)
         ```
         */
        Kokiake: '#86473F',
        /**
         ```
         桜鼠 rgb(177,150,147)
         ```
         */
        SakuraNezumi: '#B19693',
        /**
         ```
         甚三紅 rgb(235,122,119)
         ```
         */
        Zinnzamomi: '#EB7A77',
        /**
         ```
         小豆 rgb(149,74,69)
         ```
         */
        Azuki: '#954A45',
        /**
         ```
         蘇芳香 rgb(169,99,96)
         ```
         */
        Suoukou: '#A96360',
        /**
         ```
         赤紅 rgb(203,64,66)
         ```
         */
        Akabeni: '#CB4042',
        /**
         ```
         真朱 rgb(171,59,58)
         ```
         */
        Sinnsyu: '#AB3B3A',
        /**
         ```
         灰桜 rgb(215,196,187)
         ```
         */
        Haizakura: '#D7C4BB',
        /**
         ```
         栗梅 rgb(144,72,64)
         ```
         */
        Kuriume: '#904840',
        /**
         ```
         海老茶 rgb(115,67,56)
         ```
         */
        Ebitya: '#734338',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         猩猩緋 rgb(232,48,21)
         ```
         */
        Syozyohi: '#E83015',
        /**
         ```
         
         ```
         */
        /**
         ```
         金茶 rgb(199,128,45)
         ```
         */
        Kinntya: '#C7802D',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         山吹 rgb(255,177,27)
         ```
         */
        Yamabuki: '#FFB11B',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         鬱金 rgb(239,187,36)
         ```
         */
        Ukonn: '#EFBB24',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         苗 rgb(134,193,102)
         ```
         */
        Nae: '#86C166',
        /**
         ```
         
         ```
         */
        /**
         ```
         常盤 rgb(27,129,62)
         ```
         */
        Tokiwa: '#1B813E',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         緑青 rgb(36,147,110)
         ```
         */
        Rokusyou: '#24936E',
        /**
         ```
         
         ```
         */
        /**
         ```
         水浅葱 rgb(102,186,183)
         ```
         */
        Mizuasagi: '#66BAB7',
        /**
         ```
         青碧 rgb(38,135,133)
         ```
         */
        Seiheki: '#268785',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         水 rgb(129,199,212)
         ```
         */
        Mizu: '#81C7D4',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         黒橡 rgb(11,16,19)
         ```
         */
        Kuroturubami: '#0B1013',
        /**
         ```
         
         ```
         */
        /**
         ```
         褐 rgb(8,25,45)
         ```
         */
        Kati: '#08192D',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         鈍 rgb(101,103,101)
         ```
         */
        Nibi: '#656765',
        /**
         ```
         青鈍 rgb(83,89,83)
         ```
         */
        Aonibi: '#535953',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         紫苑 rgb(143,119,181)
         ```
         */
        Sionn: '#8F77B5',
        /**
         ```
         
         ```
         */
        /**
         ```
         
         ```
         */
        /**
         ```
         半 rgb()
         ```
         */
        Hasita: '#986DB2',
        /**
         ```
         胡粉 rgb(189,192,186)
         ```
         */
        Gohunn: '#FFFFFB',
        /**
         ```
         
         ```
         */
         /**
         ```
         
         ```
         */
        
        /**
         ```
         
         ```
         */
        /**
         ```
         藍墨茶 rgb(55,60,56)
         ```
         */
        Aisumitya: '#373C38',
        /**
         ```
         消炭 rgb(67,67,67)
         ```
         */
        Kesizumi: '#434343',
        /**
         ```
         墨 rgb(28,28,28)
         ```
         */
        Sumi: '#1C1C1C',
        /**
         ```
         黒 rgb(8,8,8)
         ```
         */
        Kuro: '#080808',
        /**
         ```
         呂 rgb(12,12,12)
         ```
         */
        Ro: '#0C0C0C'
    }
}


export default Color;

(window as any)['Color'] = Color;
