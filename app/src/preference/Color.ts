/*
 * @Author: Antoine YANG 
 * @Date: 2019-10-24 17:47:11 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2019-10-26 18:42:49
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
 * Color: namespace
 */
const Color = {
    linearGradient: linearGradient,

    /**
     * Colorset Nippon
     * 
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
