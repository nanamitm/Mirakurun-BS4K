const { describe, it } = require("node:test");
const assert = require("assert");

const scan = require("../lib/Mirakurun/api/config/channels/scan");

const BS_2K_TRANSPONDERS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];

function generateBsSubchannels(subchannels) {
    return BS_2K_TRANSPONDERS.flatMap(ch =>
        subchannels.map(subch => `BS${String(ch).padStart(2, "0")}_${subch}`)
    );
}

describe("[scan.spec] /api/config/channel/scan : generateScanConfig", () => {
    it("GR: Type only", () => {
        const config = scan.generateScanConfig({
            type: "GR"
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: startCh only", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            startCh: 61
        });
        assert.deepStrictEqual(config, {
            channels: ["61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: endCh only", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            endCh: 14
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: startCh and endCh", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            startCh: 10,
            endCh: 15
        });
        assert.deepStrictEqual(config, {
            channels: ["10", "11", "12", "13", "14", "15"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: subCh is not use", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: useSubCh = false", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            useSubCh: false
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: useSubCh = false and subCh", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            useSubCh: false,
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: useSubCh = true", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            useSubCh: true
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: useSubCh = true and subCh", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            useSubCh: true,
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: scanMode = Channel", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            scanMode: "Channel"
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("GR: scanMode = Service", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            scanMode: "Service"
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Service",
            setDisabledOnAdd: false
        });
    });

    it("GR: setDisabledOnAdd = true", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            setDisabledOnAdd: true
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: true
        });
    });

    it("GR: setDisabledOnAdd = false", () => {
        const config = scan.generateScanConfig({
            type: "GR",
            setDisabledOnAdd: false
        });
        assert.deepStrictEqual(config, {
            channels: ["13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "60", "61", "62"],
            scanMode: "Channel",
            setDisabledOnAdd: false
        });
    });

    it("BS: Type only", () => {
        const config = scan.generateScanConfig({
            type: "BS"
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: startCh only", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            startCh: 255
        });
        assert.deepStrictEqual(config, {
            channels: ["255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: endCh only", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            endCh: 102
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: startCh and endCh", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            startCh: 10,
            endCh: 15
        });
        assert.deepStrictEqual(config, {
            channels: ["10", "11", "12", "13", "14", "15"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: subCh is not use", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: useSubCh = false", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            useSubCh: false
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: useSubCh = false and subCh", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            useSubCh: false,
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: useSubCh = true", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            useSubCh: true
        });
        assert.deepStrictEqual(config, {
            channels: generateBsSubchannels([0, 1, 2, 3]),
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: useSubCh = true and subCh", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            useSubCh: true,
            startSubCh: 5,
            endSubCh: 8
        });
        assert.deepStrictEqual(config, {
            channels: generateBsSubchannels([5, 6, 7, 8]),
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: useSubCh = true and Ch and subCh", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            useSubCh: true,
            startCh: 30,
            endCh: 31,
            startSubCh: 10,
            endSubCh: 11
        });
        assert.deepStrictEqual(config, {
            channels: ["BS30_10", "BS30_11", "BS31_10", "BS31_11"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: scanMode = Channel", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            scanMode: "Channel"
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Channel",
            setDisabledOnAdd: true
        });
    });

    it("BS: scanMode = Service", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            scanMode: "Service"
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: setDisabledOnAdd = true", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            setDisabledOnAdd: true
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("BS: setDisabledOnAdd = false", () => {
        const config = scan.generateScanConfig({
            type: "BS",
            setDisabledOnAdd: false
        });
        assert.deepStrictEqual(config, {
            channels: ["101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157", "158", "159", "160", "161", "162", "163", "164", "165", "166", "167", "168", "169", "170", "171", "172", "173", "174", "175", "176", "177", "178", "179", "180", "181", "182", "183", "184", "185", "186", "187", "188", "189", "190", "191", "192", "193", "194", "195", "196", "197", "198", "199", "200", "201", "202", "203", "204", "205", "206", "207", "208", "209", "210", "211", "212", "213", "214", "215", "216", "217", "218", "219", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "255", "256"],
            scanMode: "Service",
            setDisabledOnAdd: false
        });
    });

    it("CS: Type only", () => {
        const config = scan.generateScanConfig({
            type: "CS"
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: startCh only", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            startCh: 23
        });
        assert.deepStrictEqual(config, {
            channels: ["CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: endCh only", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            endCh: 3
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: startCh and endCh", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            startCh: 10,
            endCh: 15
        });
        assert.deepStrictEqual(config, {
            channels: ["CS10", "CS11", "CS12", "CS13", "CS14", "CS15"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: subCh is not use", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: useSubCh = false", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            useSubCh: false
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: useSubCh = false and subCh", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            useSubCh: false,
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: useSubCh = true", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            useSubCh: true
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: useSubCh = true and subCh", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            useSubCh: true,
            startSubCh: 5,
            endSubCh: 10
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: scanMode = Channel", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            scanMode: "Channel"
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Channel",
            setDisabledOnAdd: true
        });
    });

    it("CS: scanMode = Service", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            scanMode: "Service"
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: setDisabledOnAdd = true", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            setDisabledOnAdd: true
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: true
        });
    });

    it("CS: setDisabledOnAdd = false", () => {
        const config = scan.generateScanConfig({
            type: "CS",
            setDisabledOnAdd: false
        });
        assert.deepStrictEqual(config, {
            channels: ["CS2", "CS3", "CS4", "CS5", "CS6", "CS7", "CS8", "CS9", "CS10", "CS11", "CS12", "CS13", "CS14", "CS15", "CS16", "CS17", "CS18", "CS19", "CS20", "CS21", "CS22", "CS23", "CS24"],
            scanMode: "Service",
            setDisabledOnAdd: false
        });
    });
});

describe("[scan.spec] /api/config/channel/scan : generateChannelItemForService", () => {
    it("GR Regular case", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "XXXテレビ",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: service.name,
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("BS Regular case", () => {
        const type = "BS";
        const ch = "20";
        const setDisabledOnAdd = false;
        const service = {
            name: "XXXテレビ",
            serviceId: 10
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: service.name,
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("BS Regular case (Subchannel style)", () => {
        const type = "BS";
        const ch = "BS01_1";
        const setDisabledOnAdd = false;
        const service = {
            name: "XXXテレビ",
            serviceId: 10
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: service.name,
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("CS Regular case", () => {
        const type = "CS";
        const ch = "CS30";
        const setDisabledOnAdd = false;
        const service = {
            name: "XXXテレビ",
            serviceId: 999
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: service.name,
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : half-width whitespace (end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "X　X テレビ ",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : half-width whitespace (start)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: " X　X テレビ",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : half-width whitespace (start and end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: " X　X テレビ ",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : full-width whitespace (end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "X　X テレビ　",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : full-width whitespace (start)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "　X　X テレビ",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : full-width whitespace (start and end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "　X　X テレビ　",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : multiple whitespace (start and end) case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: " 　X　X テレビ　 ",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name trim : multiple whitespace (start and end) case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "　 X　X テレビ 　",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name Empty", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const service = {
            name: "",
            serviceId: 1
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10:1",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });

    it("Name Empty trim case", () => {
        const type = "GR";
        const ch = "999";
        const setDisabledOnAdd = true;
        const service = {
            name: " 　",
            serviceId: 10
        };
        const channelItem = scan.generateChannelItemForService(type, ch, service, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR999:10",
            type: type,
            channel: ch,
            serviceId: service.serviceId,
            isDisabled: setDisabledOnAdd
        });
    });
});

describe("[scan.spec] /api/config/channel/scan : generateChannelItemForChannel (single service)", () => {
    it("GR Regular case", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "XXXテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: services[0].name,
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("BS Regular case", () => {
        const type = "BS";
        const ch = "20";
        const setDisabledOnAdd = false;
        const services = [
            { name: "XXXテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: services[0].name,
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("BS Regular case (Subchannel style)", () => {
        const type = "BS";
        const ch = "BS01_1";
        const setDisabledOnAdd = false;
        const services = [
            { name: "XXXテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: services[0].name,
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("CS Regular case", () => {
        const type = "CS";
        const ch = "CS30";
        const setDisabledOnAdd = false;
        const services = [
            { name: "XXXテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: services[0].name,
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : half-width whitespace (end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "X　X テレビ " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : half-width whitespace (start)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " X　X テレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : half-width whitespace (start and end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " X　X テレビ " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : full-width whitespace (end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "X　X テレビ　" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : full-width whitespace (start)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "　X　X テレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : full-width whitespace (start and end)", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "　X　X テレビ　" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : multiple whitespace (start and end) case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " 　X　X テレビ　 " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name trim : multiple whitespace (start and end) case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "　 X　X テレビ 　" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "X　X テレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Empty", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Empty trim case", () => {
        const type = "GR";
        const ch = "999";
        const setDisabledOnAdd = true;
        const services = [
            { name: " 　" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR999",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });
});

describe("[scan.spec] /api/config/channel/scan : generateChannelItemForChannel (multiple service)", () => {
    it("Name Summary regular case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ１" },
            { name: "xxxテレビ２" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary regular case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ" },
            { name: "xxxテレビ１" },
            { name: "xxxテレビ２" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary regular case.3", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ" },
            { name: "xxxテレビ１" },
            { name: "データ通信" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary regular case.4", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ" },
            { name: "xxxテレビ" },
            { name: "xxxテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary regular case.5", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ総合" },
            { name: "xxxテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary regular case.6", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "aaaテレビ" },
            { name: "bbbテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "aaaテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " xxxテレビ " },
            { name: " xxxテレビ " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " xxxテレビ " },
            { name: " xxxテレビ" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.3", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " xxxテレビ " },
            { name: " xxxTV" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxx",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.4", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " xxxテレビ " },
            { name: " aaaテレビ " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.5", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " xxxテレビ " },
            { name: "xxxTV " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.6", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ " },
            { name: "xxxテレビ １" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary and trim.7", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "xxxテレビ １" },
            { name: "xxxテレビ " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "xxxテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Full text match case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "abcdefg" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Full text match case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "abcdefgf" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Full text match case.3", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "xxxxx" },
            { name: "abcdefg" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Full text match case.4", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "xxxxx" },
            { name: "abcdefg" },
            { name: "xxx" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Partial text match case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "abcabc" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abc",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Partial text match case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "xxxx" },
            { name: "abcabc" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abc",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Partial text match case.3", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "xxxx" },
            { name: "abcabc" },
            { name: "yyy" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abc",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Not match case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "xxxx" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Not match case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "xabcdefg" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Not match case.3", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "yyy" },
            { name: "xxx" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Not match case.4", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: "" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Not match case.5", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "abcdefg" },
            { name: " " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "abcdefg",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Empty case.1", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "" },
            { name: "abcdefg" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Empty case.2", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "" },
            { name: "" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Empty case.3", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "" },
            { name: " " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Empty case.4", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " " },
            { name: "abcdefg" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Empty case.5", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " " },
            { name: "" }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });

    it("Name Summary : Empty case.6", () => {
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: " " },
            { name: " " }
        ];
        const channelItem = scan.generateChannelItemForChannel(type, ch, services, setDisabledOnAdd);
        assert.deepStrictEqual(channelItem, {
            name: "GR10",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItem, false);
    });
});

describe("[scan.spec] /api/config/channel/scan : generateChannelItems", () => {
    it("Service mode case.1", () => {
        const mode = "Service";
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "XXXテレビ", serviceId: 1 }
        ];
        const channelItems = scan.generateChannelItems(mode, type, ch, services, setDisabledOnAdd);
        assert.strictEqual(channelItems.length, services.length);
        for (let i = 0; i < channelItems.length; i++) {
            assert.deepStrictEqual(channelItems[i], {
                name: services[i].name,
                type: type,
                channel: ch,
                serviceId: services[i].serviceId,
                isDisabled: setDisabledOnAdd
            });
        }
    });

    it("Service mode case.2 : multiple service", () => {
        const mode = "Service";
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "XXXテレビ１", serviceId: 101 },
            { name: "XXXテレビ２", serviceId: 102 }
        ];
        const channelItems = scan.generateChannelItems(mode, type, ch, services, setDisabledOnAdd);
        assert.strictEqual(channelItems.length, services.length);
        for (let i = 0; i < channelItems.length; i++) {
            assert.deepStrictEqual(channelItems[i], {
                name: services[i].name,
                type: type,
                channel: ch,
                serviceId: services[i].serviceId,
                isDisabled: setDisabledOnAdd
            });
        }
    });

    it("Channel mode case.1", () => {
        const mode = "Channel";
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "XXXテレビ", serviceId: 1 }
        ];
        const channelItems = scan.generateChannelItems(mode, type, ch, services, setDisabledOnAdd);
        assert.strictEqual(channelItems.length, 1);
        assert.deepStrictEqual(channelItems[0], {
            name: services[0].name,
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItems[0], false);
    });

    it("Channel mode case.2 : multiple service", () => {
        const mode = "Channel";
        const type = "GR";
        const ch = "10";
        const setDisabledOnAdd = true;
        const services = [
            { name: "XXXテレビ１", serviceId: 101 },
            { name: "XXXテレビ２", serviceId: 102 }
        ];
        const channelItems = scan.generateChannelItems(mode, type, ch, services, setDisabledOnAdd);
        assert.strictEqual(channelItems.length, 1);
        assert.deepStrictEqual(channelItems[0], {
            name: "XXXテレビ",
            type: type,
            channel: ch,
            isDisabled: setDisabledOnAdd
        });
        assert.strictEqual("serviceId" in channelItems[0], false);
    });
});
