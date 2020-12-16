<template>
  <!-- <vue-excel-editor v-model="records" no-paging free-select filter-row>
    <vue-excel-column  v-for="(header,index) in tableHeaders" :field="header.name" :label="header.label" :key="index" />
  </vue-excel-editor> -->
  <div>
    <FilterModal
      v-if="showFilterModal"
      :data="this.filterData"
      v-model="showFilterModal"
      @filterwith="applyFilter"
    />
    <table id="tableId" style="width: 95%; margin: auto; font-size: 12px">
      <tr>
        <td
          class="headers"
          v-for="(header, index) in tableHeaders"
          :key="index"
          style="border-bottom:lightgray 1px solid;padding:0.25rem 0.1rem;text-overflow:ellipsis;max-width: 50pxoverflow: hidden; white-space: nowrap;"
          :style="header.type == 'Number' ? 'text-align:right' : ''"
        >
          <div
            @dblclick="selectColumn"
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
            "
            :id="'C' + (index + 1)"
          >
            <div
              class="my-auto"
              :id="'C' + (index + 1)"
              @dblclick="selectColumn"
            >
              {{ header.label.toUpperCase() }}
            </div>
            <i
              :id="'filterC' + (index + 1)"
              class="mdi mdi-filter mdi-16px ml-8 my-auto"
              style="color: lightgray"
              @click="prepareFilterModal"
            ></i>
            <div class="my-auto" style="display: flex; flex-direction: column">
              <i
                :id="'sortAscendingC' + (index + 1)"
                class="mdi mdi-menu-up"
                style="color: lightgray"
                @click="sortColumn(index + 1, 'ascending')"
              ></i>
              <i
                :id="'sortDescendingC' + (index + 1)"
                class="mdi mdi-menu-down"
                style="color: lightgray"
                @click="sortColumn(index + 1, 'descending')"
              ></i>
            </div>
          </div>
        </td>
      </tr>
      <tr
        class="records"
        :id="'R' + (index + 1)"
        v-for="(row, index) in recordsFormatted"
        :key="index"
        @click="selectRow"
      >
        <td
          :id="'R' + (index + 1) + 'C' + (indexField + 1)"
          v-for="(field, key, indexField) in row"
          :key="indexField"
          style="
            padding: 0.25rem 0.1rem;
            text-overflow: ellipsis;
            max-width: 50px;
            overflow: hidden;
            white-space: nowrap;
          "
          :style="
            tableHeaders[indexField].type == 'Number' ? 'text-align:right' : ''
          "
        >
          {{ row[tableHeaders[indexField].name] }}
        </td>
      </tr>
    </table>
    <v-slider
      style="width: 25%"
      max="200"
      min="50"
      v-model="zoomLevel"
      thumb-label="always"
    ></v-slider>
  </div>
</template>

<script>
import _ from "lodash";
import FilterModal from "./FilterModal";

export default {
  name: "DataTable",
  components: {
    FilterModal,
  },
  watch: {
    zoomLevel() {
      document.getElementById("tableId").style.fontSize =
        12 * (this.zoomLevel / 100) + "px";
    },
  },
  methods: {
    prepareFilterModal(event) {
      let colNumber = parseInt(event.target.id.split("C")[1]);
      this.filterData["label"] = this.tableHeaders[colNumber - 1].label;
      this.filterData["name"] = this.tableHeaders[colNumber - 1].name;
      this.filterData["type"] = this.tableHeaders[colNumber - 1].type;
      this.filterData["items"] = this.records.map(
        (value) => value[this.tableHeaders[colNumber - 1].name]
      );
      this.showFilterModal = true;
    },
    applyFilter(data) {
      this.recordsFormatted = this.recordsFormatted.filter(e => 
      data["filters"].includes(e[data.name]));
    },
    sortColumn(colNumber, sortType) {
      let columnName = this.tableHeaders[colNumber - 1].name;
      if (this.selectedColumnsToSort[colNumber - 1].sortType == sortType) {
        this.selectedColumnsToSort[colNumber - 1].sortType = "none";
        this.selectedColumnsToSort[colNumber - 1].order = -1;
        this.recordsFormatted = _.cloneDeep(this.records);
      } else {
        this.selectedColumnsToSort[colNumber - 1].sortType = sortType;
        this.selectedColumnsToSort[this.selectedColumnsToSort.length - 1]
          .maxOrder++;
        this.selectedColumnsToSort[
          colNumber - 1
        ].order = this.selectedColumnsToSort[
          this.selectedColumnsToSort.length - 1
        ].maxOrder;
        this.recordsFormatted =
          sortType == "ascending"
            ? this.recordsFormatted.sort(compare)
            : this.recordsFormatted.sort(compare).reverse();
        function compare(a, b) {
          return a[columnName] > b[columnName]
            ? 1
            : a[columnName] < b[columnName]
            ? -1
            : 0;
        }
      }
    },
    selectRow(e) {
      const alreadySelected = document.getElementsByClassName("selected");
      while (alreadySelected.length) {
        alreadySelected[0].classList.remove("selected");
      }
      let rowNumber = e.target.id.split("C")[0];
      document
        .querySelectorAll('[id^="' + rowNumber + 'C"]')
        .forEach(function (item) {
          item.classList.add("selected");
        });
    },
    selectColumn(e) {
      const alreadySelected = document.getElementsByClassName("selected");
      while (alreadySelected.length) {
        alreadySelected[0].classList.remove("selected");
      }
      let colNumber = e.target.id.split("C")[1];
      if (this.selectedColumns == colNumber) {
        document
          .querySelectorAll('[id$="C' + colNumber + '"][id^="R"]')
          .forEach(function (item) {
            item.classList.remove("selected");
          });
        this.selectedColumns = "";
      } else {
        this.selectedColumns = colNumber;
        document
          .querySelectorAll('[id$="C' + colNumber + '"][id^="R"]')
          .forEach(function (item) {
            item.classList.add("selected");
          });
      }
    },
  },
  mounted() {
    this.recordsFormatted = _.cloneDeep(this.records);
    this.selectedColumnsToSort = Array.from(
      { length: this.tableHeaders.length },
      () => ({ sortType: "none", order: -1 })
    );
    this.selectedColumnsToSort.push({ maxOrder: -1 });
  },
  data() {
    return {
      zoomLevel: 100,
      tableHeaders: [
        { name: "id", label: "ID", type: "Number" },
        { name: "first_name", label: "First Name", type: "String" },
        { name: "last_name", label: "Last Name", type: "String" },
        { name: "email", label: "E-mail", type: "String" },
        { name: "gender", label: "Gender", type: "String" },
        { name: "ip_address", label: "IP Address", type: "String" },
        { name: "Color", label: "Color", type: "String" },
        { name: "passcode", label: "Passcode", type: "String" },
        { name: "Job", label: "Job", type: "String" },
        { name: "Stock Name", label: "Stock Name", type: "String" },
        {
          name: "Date_transaction",
          label: "Date Of Transaction",
          type: "Date",
        },
        { name: "Amount", label: "Amount", type: "Money" },
      ],
      recordsFormatted: [],
      records: [
        {
          id: 1,
          first_name: "Reamonn",
          last_name: "Cordey",
          email: "rcordey0@nymag.com",
          gender: "Male",
          ip_address: "118.148.59.148",
          Date_transaction: "09/08/2020",
          Color: "Red",
          passcode: "3f5GyDlP804",
          Job: "Executive Secretary",
          "Stock Name": "HFF, Inc.",
          Amount: "$451038.98",
        },
        {
          id: 2,
          first_name: "Nicol",
          last_name: "Pigeon",
          email: "npigeon1@aboutads.info",
          gender: "Female",
          ip_address: "17.83.251.146",
          Date_transaction: "10/21/2022",
          Color: "Blue",
          passcode: "txhzhmvD643",
          Job: "Data Coordiator",
          "Stock Name": "Red Robin Gourmet Burgers, Inc.",
          Amount: "$535427.86",
        },
        {
          id: 3,
          first_name: "Karyn",
          last_name: "Mapplebeck",
          email: "kmapplebeck2@sfgate.com",
          gender: "Female",
          ip_address: "213.188.211.151",
          Date_transaction: "04/24/2019",
          Color: "Mauv",
          passcode: "omhSyZ0Z484",
          Job: "Graphic Designer",
          "Stock Name": "First Cash, Inc.",
          Amount: "$668820.68",
        },
        {
          id: 4,
          first_name: "Luther",
          last_name: "Fishenden",
          email: "lfishenden3@smh.com.au",
          gender: "Male",
          ip_address: "64.92.130.53",
          Date_transaction: "04/09/2021",
          Color: "Fuscia",
          passcode: "qNb3kZRv573",
          Job: "Environmental Specialist",
          "Stock Name": "Reinsurance Group of America, Incorporated",
          Amount: "$102244.31",
        },
        {
          id: 5,
          first_name: "Bonita",
          last_name: "Bartlosz",
          email: "bbartlosz4@answers.com",
          gender: "Female",
          ip_address: "16.28.242.165",
          Date_transaction: "05/14/2020",
          Color: "Maroon",
          passcode: "ZpD8ANw2278",
          Job: "Research Nurse",
          "Stock Name": "Inter Parfums, Inc.",
          Amount: "$63412.52",
        },
        {
          id: 6,
          first_name: "Julietta",
          last_name: "Jeggo",
          email: "jjeggo5@friendfeed.com",
          gender: "Female",
          ip_address: "94.48.154.47",
          Date_transaction: "03/27/2019",
          Color: "Yellow",
          passcode: "vTf3Hs1T373",
          Job: "Data Coordiator",
          "Stock Name": "GSV Capital Corp",
          Amount: "$618351.65",
        },
        {
          id: 7,
          first_name: "Rubina",
          last_name: "Seligson",
          email: "rseligson6@aboutads.info",
          gender: "Female",
          ip_address: "154.178.217.150",
          Date_transaction: "02/26/2020",
          Color: "Turquoise",
          passcode: "AGbP3cC8278",
          Job: "Recruiter",
          "Stock Name": "Johnson Outdoors Inc.",
          Amount: "$856530.87",
        },
        {
          id: 8,
          first_name: "Yorker",
          last_name: "Dallosso",
          email: "ydallosso7@nationalgeographic.com",
          gender: "Male",
          ip_address: "210.145.148.15",
          Date_transaction: "01/15/2019",
          Color: "Yellow",
          passcode: "ZbQfeoID278",
          Job: "Human Resources Assistant III",
          "Stock Name": "Mesa Laboratories, Inc.",
          Amount: "$486871.47",
        },
        {
          id: 9,
          first_name: "Jone",
          last_name: "Yu",
          email: "jyu8@studiopress.com",
          gender: "Male",
          ip_address: "236.110.121.70",
          Date_transaction: "02/18/2019",
          Color: "Crimson",
          passcode: "ROH5TAKh765",
          Job: "Senior Sales Associate",
          "Stock Name": "Taiwan Semiconductor Manufacturing Company Ltd.",
          Amount: "$66644.93",
        },
        {
          id: 10,
          first_name: "Ardisj",
          last_name: "Mardlin",
          email: "amardlin9@google.de",
          gender: "Female",
          ip_address: "247.37.19.92",
          Date_transaction: "10/22/2021",
          Color: "Teal",
          passcode: "hIcuqtcS529",
          Job: "Recruiter",
          "Stock Name": "Bravo Brio Restaurant Group, Inc.",
          Amount: "$646690.61",
        },
        {
          id: 11,
          first_name: "Kelly",
          last_name: "Queyeiro",
          email: "kqueyeiroa@goo.ne.jp",
          gender: "Male",
          ip_address: "103.92.208.171",
          Date_transaction: "08/30/2019",
          Color: "Yellow",
          passcode: "cqRxDvcU434",
          Job: "Cost Accountant",
          "Stock Name": "Pioneer Municipal High Income Trust",
          Amount: "$931127.64",
        },
        {
          id: 12,
          first_name: "Marcelia",
          last_name: "Speke",
          email: "mspekeb@economist.com",
          gender: "Female",
          ip_address: "59.175.192.196",
          Date_transaction: "07/14/2022",
          Color: "Mauv",
          passcode: "00o3Zw3A382",
          Job: "Legal Assistant",
          "Stock Name": "Evoke Pharma, Inc.",
          Amount: "$478879.81",
        },
        {
          id: 13,
          first_name: "Rice",
          last_name: "Burnep",
          email: "rburnepc@simplemachines.org",
          gender: "Male",
          ip_address: "134.11.118.140",
          Date_transaction: "06/15/2020",
          Color: "Pink",
          passcode: "XCsQAIL7329",
          Job: "Web Designer III",
          "Stock Name": "Nuveen High Income 2020 Target Term Fund",
          Amount: "$160145.42",
        },
        {
          id: 14,
          first_name: "Woodrow",
          last_name: "Kubu",
          email: "wkubud@ning.com",
          gender: "Male",
          ip_address: "167.28.76.94",
          Date_transaction: "01/14/2020",
          Color: "Indigo",
          passcode: "uXPQKGbG416",
          Job: "Automation Specialist III",
          "Stock Name": "Forrester Research, Inc.",
          Amount: "$755249.01",
        },
        {
          id: 15,
          first_name: "Minnnie",
          last_name: "Tate",
          email: "mtatee@delicious.com",
          gender: "Female",
          ip_address: "218.220.154.39",
          Date_transaction: "03/16/2020",
          Color: "Orange",
          passcode: "oqN4p433760",
          Job: "Mechanical Systems Engineer",
          "Stock Name": "Iconix Brand Group, Inc.",
          Amount: "$408167.39",
        },
        {
          id: 16,
          first_name: "Bobinette",
          last_name: "MacCombe",
          email: "bmaccombef@hc360.com",
          gender: "Female",
          ip_address: "226.171.60.169",
          Date_transaction: "02/19/2020",
          Color: "Crimson",
          passcode: "gMVlo3UZ315",
          Job: "Technical Writer",
          "Stock Name": "Aevi Genomic Medicine, Inc.",
          Amount: "$832835.12",
        },
        {
          id: 17,
          first_name: "Tanhya",
          last_name: "Meys",
          email: "tmeysg@unc.edu",
          gender: "Female",
          ip_address: "57.139.69.117",
          Date_transaction: "01/26/2020",
          Color: "Turquoise",
          passcode: "yvgJvYyb946",
          Job: "VP Quality Control",
          "Stock Name": "First Trust Enhanced Short Maturity ETF",
          Amount: "$510610.82",
        },
        {
          id: 18,
          first_name: "Ophelia",
          last_name: "Dermott",
          email: "odermotth@utexas.edu",
          gender: "Female",
          ip_address: "150.24.195.167",
          Date_transaction: "07/08/2021",
          Color: "Purple",
          passcode: "ERmFtHAm353",
          Job: "Help Desk Operator",
          "Stock Name": "Perma-Pipe International Holdings, Inc.",
          Amount: "$701548.01",
        },
        {
          id: 19,
          first_name: "Denyse",
          last_name: "Waslin",
          email: "dwaslini@123-reg.co.uk",
          gender: "Female",
          ip_address: "102.213.81.173",
          Date_transaction: "03/03/2020",
          Color: "Maroon",
          passcode: "iDSpnK6P991",
          Job: "Statistician III",
          "Stock Name": "Cumberland Pharmaceuticals Inc.",
          Amount: "$440913.09",
        },
        {
          id: 20,
          first_name: "Kimball",
          last_name: "Brumby",
          email: "kbrumbyj@hibu.com",
          gender: "Male",
          ip_address: "165.97.151.207",
          Date_transaction: "12/21/2021",
          Color: "Crimson",
          passcode: "CI85UQDI802",
          Job: "Marketing Manager",
          "Stock Name": "Nexeo Solutions, Inc.",
          Amount: "$215041.20",
        },
        {
          id: 21,
          first_name: "Goldia",
          last_name: "Mardling",
          email: "gmardlingk@merriam-webster.com",
          gender: "Female",
          ip_address: "66.188.100.58",
          Date_transaction: "04/06/2022",
          Color: "Crimson",
          passcode: "By3DcP5O387",
          Job: "VP Product Management",
          "Stock Name": "Eagle Point Credit Company Inc.",
          Amount: "$652329.52",
        },
        {
          id: 22,
          first_name: "Vivienne",
          last_name: "O'Brallaghan",
          email: "vobrallaghanl@freewebs.com",
          gender: "Female",
          ip_address: "189.245.241.97",
          Date_transaction: "02/13/2021",
          Color: "Crimson",
          passcode: "3kcG7cHC558",
          Job: "Community Outreach Specialist",
          "Stock Name": "SAExploration Holdings, Inc.",
          Amount: "$958556.32",
        },
        {
          id: 23,
          first_name: "Margarethe",
          last_name: "Fergyson",
          email: "mfergysonm@sourceforge.net",
          gender: "Female",
          ip_address: "135.163.86.174",
          Date_transaction: "10/17/2020",
          Color: "Teal",
          passcode: "QLfO18jh629",
          Job: "VP Accounting",
          "Stock Name": "BlackRock California Municipal Income Trust",
          Amount: "$580090.87",
        },
        {
          id: 24,
          first_name: "Keeley",
          last_name: "Coate",
          email: "kcoaten@hatena.ne.jp",
          gender: "Female",
          ip_address: "147.210.42.70",
          Date_transaction: "04/24/2019",
          Color: "Violet",
          passcode: "uQUeMnAS239",
          Job: "Desktop Support Technician",
          "Stock Name": "Sigma Labs, Inc.",
          Amount: "$528364.04",
        },
        {
          id: 25,
          first_name: "Opal",
          last_name: "Bouch",
          email: "oboucho@springer.com",
          gender: "Female",
          ip_address: "148.73.151.240",
          Date_transaction: "04/13/2020",
          Color: "Green",
          passcode: "gjxxZZ4t722",
          Job: "Information Systems Manager",
          "Stock Name": "Innocoll Holdings",
          Amount: "$893216.92",
        },
        {
          id: 26,
          first_name: "Goldy",
          last_name: "Chrystal",
          email: "gchrystalp@github.io",
          gender: "Female",
          ip_address: "139.109.42.248",
          Date_transaction: "03/31/2021",
          Color: "Teal",
          passcode: "ENdVUIgZ310",
          Job: "Tax Accountant",
          "Stock Name": "ANI Pharmaceuticals, Inc.",
          Amount: "$339964.10",
        },
        {
          id: 27,
          first_name: "Jobyna",
          last_name: "Middler",
          email: "jmiddlerq@timesonline.co.uk",
          gender: "Female",
          ip_address: "128.42.224.58",
          Date_transaction: "12/15/2019",
          Color: "Blue",
          passcode: "OFtuyXzG030",
          Job: "Cost Accountant",
          "Stock Name": "The Medicines Company",
          Amount: "$729768.26",
        },
        {
          id: 28,
          first_name: "Millisent",
          last_name: "Maylin",
          email: "mmaylinr@epa.gov",
          gender: "Female",
          ip_address: "166.224.111.134",
          Date_transaction: "02/15/2022",
          Color: "Maroon",
          passcode: "A6C5pS4T649",
          Job: "Biostatistician IV",
          "Stock Name": "Calithera Biosciences, Inc.",
          Amount: "$251474.68",
        },
        {
          id: 29,
          first_name: "Florian",
          last_name: "Fullstone",
          email: "ffullstones@opera.com",
          gender: "Male",
          ip_address: "129.48.10.218",
          Date_transaction: "09/28/2019",
          Color: "Puce",
          passcode: "nTKomq5Z835",
          Job: "Occupational Therapist",
          "Stock Name": "Alamos Gold Inc.",
          Amount: "$657737.60",
        },
        {
          id: 30,
          first_name: "Valery",
          last_name: "Beese",
          email: "vbeeset@themeforest.net",
          gender: "Female",
          ip_address: "204.136.119.106",
          Date_transaction: "01/16/2020",
          Color: "Green",
          passcode: "W4u4DKWH920",
          Job: "Account Coordinator",
          "Stock Name": "Sabine Royalty Trust",
          Amount: "$994179.00",
        },
        {
          id: 31,
          first_name: "Blanche",
          last_name: "Waugh",
          email: "bwaughu@google.com",
          gender: "Female",
          ip_address: "179.232.54.122",
          Date_transaction: "06/01/2022",
          Color: "Orange",
          passcode: "0eygD1c8516",
          Job: "Nurse",
          "Stock Name": "Dollar General Corporation",
          Amount: "$334054.40",
        },
        {
          id: 32,
          first_name: "Abbie",
          last_name: "Seekings",
          email: "aseekingsv@behance.net",
          gender: "Female",
          ip_address: "114.171.213.138",
          Date_transaction: "02/24/2020",
          Color: "Red",
          passcode: "HaiAwKB9229",
          Job: "Automation Specialist III",
          "Stock Name": "BWX Technologies, Inc.",
          Amount: "$947520.19",
        },
        {
          id: 33,
          first_name: "Alphonse",
          last_name: "Polglase",
          email: "apolglasew@netlog.com",
          gender: "Male",
          ip_address: "207.50.14.92",
          Date_transaction: "09/20/2022",
          Color: "Khaki",
          passcode: "007OaOYz857",
          Job: "Teacher",
          "Stock Name": "iPath US Treasury 10-year Bull ETN",
          Amount: "$527027.96",
        },
        {
          id: 34,
          first_name: "Thayne",
          last_name: "Abramow",
          email: "tabramowx@geocities.jp",
          gender: "Male",
          ip_address: "206.216.159.55",
          Date_transaction: "11/29/2018",
          Color: "Aquamarine",
          passcode: "ipaSMMyC820",
          Job: "Project Manager",
          "Stock Name": "CMS Energy Corporation",
          Amount: "$538292.31",
        },
        {
          id: 35,
          first_name: "Rahel",
          last_name: "Growden",
          email: "rgrowdeny@mail.ru",
          gender: "Female",
          ip_address: "87.179.236.23",
          Date_transaction: "11/19/2021",
          Color: "Khaki",
          passcode: "vf7FLLPu309",
          Job: "Junior Executive",
          "Stock Name": "Mitcham Industries, Inc.",
          Amount: "$590841.99",
        },
        {
          id: 36,
          first_name: "Orrin",
          last_name: "Chansonne",
          email: "ochansonnez@4shared.com",
          gender: "Male",
          ip_address: "181.164.127.128",
          Date_transaction: "07/13/2019",
          Color: "Maroon",
          passcode: "2z9uLYv3807",
          Job: "Sales Associate",
          "Stock Name": "Reynolds American Inc",
          Amount: "$505392.23",
        },
        {
          id: 37,
          first_name: "Tiff",
          last_name: "O'Codihie",
          email: "tocodihie10@smh.com.au",
          gender: "Female",
          ip_address: "216.134.110.139",
          Date_transaction: "08/21/2020",
          Color: "Turquoise",
          passcode: "mA5haY89413",
          Job: "Assistant Manager",
          "Stock Name": "Algonquin Power & Utilities Corp.",
          Amount: "$997305.92",
        },
        {
          id: 38,
          first_name: "Tomasina",
          last_name: "Muzzollo",
          email: "tmuzzollo11@paginegialle.it",
          gender: "Female",
          ip_address: "178.232.42.252",
          Date_transaction: "10/25/2019",
          Color: "Teal",
          passcode: "dKIPmu26919",
          Job: "Marketing Assistant",
          "Stock Name": "NexPoint Residential Trust, Inc.",
          Amount: "$129948.94",
        },
        {
          id: 39,
          first_name: "Reilly",
          last_name: "FitzGeorge",
          email: "rfitzgeorge12@intel.com",
          gender: "Male",
          ip_address: "188.235.133.137",
          Date_transaction: "11/21/2019",
          Color: "Crimson",
          passcode: "fg1RkIea202",
          Job: "Sales Representative",
          "Stock Name": "Luxoft Holding, Inc.",
          Amount: "$982864.98",
        },
        {
          id: 40,
          first_name: "Buiron",
          last_name: "Worham",
          email: "bworham13@cam.ac.uk",
          gender: "Male",
          ip_address: "69.33.4.87",
          Date_transaction: "12/13/2020",
          Color: "Violet",
          passcode: "CzMt0cvl703",
          Job: "Account Representative II",
          "Stock Name": "Dunkin' Brands Group, Inc.",
          Amount: "$19901.05",
        },
        {
          id: 41,
          first_name: "Yankee",
          last_name: "Lindermann",
          email: "ylindermann14@europa.eu",
          gender: "Male",
          ip_address: "108.70.225.31",
          Date_transaction: "01/01/2021",
          Color: "Turquoise",
          passcode: "nhhkfGTx302",
          Job: "Account Coordinator",
          "Stock Name": "First Trust Dorsey Wright Dynamic Focus 5 ETF",
          Amount: "$631633.18",
        },
        {
          id: 42,
          first_name: "Rosemonde",
          last_name: "Gowanlock",
          email: "rgowanlock15@biblegateway.com",
          gender: "Female",
          ip_address: "11.233.183.32",
          Date_transaction: "10/27/2022",
          Color: "Green",
          passcode: "oWmuHKyD591",
          Job: "Account Executive",
          "Stock Name": "Exxon Mobil Corporation",
          Amount: "$528706.47",
        },
        {
          id: 43,
          first_name: "Brandy",
          last_name: "Lennon",
          email: "blennon16@bravesites.com",
          gender: "Male",
          ip_address: "186.138.48.107",
          Date_transaction: "07/28/2019",
          Color: "Violet",
          passcode: "U0luOJqi169",
          Job: "Nurse Practicioner",
          "Stock Name": "WildHorse Resource Development Corporation",
          Amount: "$238603.31",
        },
        {
          id: 44,
          first_name: "Cross",
          last_name: "Labbe",
          email: "clabbe17@de.vu",
          gender: "Male",
          ip_address: "147.151.119.226",
          Date_transaction: "11/20/2018",
          Color: "Fuscia",
          passcode: "QdSeiuaf566",
          Job: "Product Engineer",
          "Stock Name": "Macro Bank Inc.",
          Amount: "$978864.55",
        },
        {
          id: 45,
          first_name: "Starlene",
          last_name: "Briand",
          email: "sbriand18@zdnet.com",
          gender: "Female",
          ip_address: "81.190.79.76",
          Date_transaction: "07/03/2022",
          Color: "Aquamarine",
          passcode: "1RYpMLkr657",
          Job: "Chief Design Engineer",
          "Stock Name": "Blue Hills Bancorp, Inc.",
          Amount: "$479646.02",
        },
        {
          id: 46,
          first_name: "Brittne",
          last_name: "Greson",
          email: "bgreson19@hugedomains.com",
          gender: "Female",
          ip_address: "76.123.209.91",
          Date_transaction: "09/23/2022",
          Color: "Fuscia",
          passcode: "vw3awaJb877",
          Job: "Senior Quality Engineer",
          "Stock Name": "Zynerba Pharmaceuticals, Inc.",
          Amount: "$863864.16",
        },
        {
          id: 47,
          first_name: "Ken",
          last_name: "Munn",
          email: "kmunn1a@ucsd.edu",
          gender: "Male",
          ip_address: "142.196.223.70",
          Date_transaction: "03/28/2019",
          Color: "Green",
          passcode: "dcOwiJc4264",
          Job: "Financial Analyst",
          "Stock Name": "Leucadia National Corporation",
          Amount: "$23295.11",
        },
        {
          id: 48,
          first_name: "Drucy",
          last_name: "McKinnon",
          email: "dmckinnon1b@ehow.com",
          gender: "Female",
          ip_address: "166.132.137.131",
          Date_transaction: "11/01/2020",
          Color: "Aquamarine",
          passcode: "0zfiEc7q756",
          Job: "Accountant IV",
          "Stock Name": "LaSalle Hotel Properties",
          Amount: "$832199.34",
        },
        {
          id: 49,
          first_name: "Pietra",
          last_name: "Fratczak",
          email: "pfratczak1c@msn.com",
          gender: "Female",
          ip_address: "85.22.141.230",
          Date_transaction: "01/21/2022",
          Color: "Khaki",
          passcode: "jr3UqYgP391",
          Job: "Financial Advisor",
          "Stock Name": "CBIZ, Inc.",
          Amount: "$204419.04",
        },
        {
          id: 50,
          first_name: "Georg",
          last_name: "Murcott",
          email: "gmurcott1d@sun.com",
          gender: "Male",
          ip_address: "52.214.156.102",
          Date_transaction: "09/26/2020",
          Color: "Yellow",
          passcode: "dkKzmgtf812",
          Job: "Engineer II",
          "Stock Name": "HSBC Holdings plc",
          Amount: "$716079.31",
        },
        {
          id: 51,
          first_name: "Zak",
          last_name: "Goodrick",
          email: "zgoodrick1e@tamu.edu",
          gender: "Male",
          ip_address: "159.65.87.249",
          Date_transaction: "04/08/2021",
          Color: "Purple",
          passcode: "Lb6GHwUH830",
          Job: "Cost Accountant",
          "Stock Name": "Advaxis, Inc.",
          Amount: "$978639.05",
        },
        {
          id: 52,
          first_name: "Devy",
          last_name: "Cotes",
          email: "dcotes1f@seattletimes.com",
          gender: "Male",
          ip_address: "107.2.46.179",
          Date_transaction: "10/16/2022",
          Color: "Crimson",
          passcode: "iFFpQyfw712",
          Job: "VP Sales",
          "Stock Name": "V.F. Corporation",
          Amount: "$102800.66",
        },
        {
          id: 53,
          first_name: "Bibbie",
          last_name: "Sunnucks",
          email: "bsunnucks1g@marriott.com",
          gender: "Female",
          ip_address: "18.4.103.213",
          Date_transaction: "06/10/2019",
          Color: "Khaki",
          passcode: "v9UYw7Od019",
          Job: "Physical Therapy Assistant",
          "Stock Name": "Synovus Financial Corp.",
          Amount: "$720880.80",
        },
        {
          id: 54,
          first_name: "Patrizius",
          last_name: "Fradgley",
          email: "pfradgley1h@alexa.com",
          gender: "Male",
          ip_address: "9.55.141.1",
          Date_transaction: "10/28/2020",
          Color: "Turquoise",
          passcode: "R3lbVRHm907",
          Job: "Structural Engineer",
          "Stock Name": "NMI Holdings Inc",
          Amount: "$95036.95",
        },
        {
          id: 55,
          first_name: "Vernon",
          last_name: "Lang",
          email: "vlang1i@gmpg.org",
          gender: "Male",
          ip_address: "49.203.81.26",
          Date_transaction: "10/10/2022",
          Color: "Green",
          passcode: "IKgUNCjq806",
          Job: "Database Administrator III",
          "Stock Name": "TransUnion",
          Amount: "$27660.23",
        },
        {
          id: 56,
          first_name: "Somerset",
          last_name: "Noddle",
          email: "snoddle1j@senate.gov",
          gender: "Male",
          ip_address: "249.105.78.192",
          Date_transaction: "06/28/2019",
          Color: "Crimson",
          passcode: "eqnis2kA334",
          Job: "GIS Technical Architect",
          "Stock Name": "At Home Group Inc.",
          Amount: "$818951.44",
        },
        {
          id: 57,
          first_name: "Jillian",
          last_name: "Wike",
          email: "jwike1k@slashdot.org",
          gender: "Female",
          ip_address: "63.52.131.239",
          Date_transaction: "03/14/2022",
          Color: "Crimson",
          passcode: "mnAkiZih564",
          Job: "Community Outreach Specialist",
          "Stock Name": "Biglari Holdings Inc.",
          Amount: "$331739.37",
        },
        {
          id: 58,
          first_name: "Sutton",
          last_name: "Kroon",
          email: "skroon1l@abc.net.au",
          gender: "Male",
          ip_address: "15.182.143.8",
          Date_transaction: "09/10/2019",
          Color: "Yellow",
          passcode: "jndpExBi331",
          Job: "Technical Writer",
          "Stock Name": "Cadence Design Systems, Inc.",
          Amount: "$765140.02",
        },
        {
          id: 59,
          first_name: "Dick",
          last_name: "Pithie",
          email: "dpithie1m@theguardian.com",
          gender: "Male",
          ip_address: "172.61.107.17",
          Date_transaction: "06/14/2019",
          Color: "Violet",
          passcode: "Q6lZsgkN893",
          Job: "VP Accounting",
          "Stock Name": "Jamba, Inc.",
          Amount: "$328264.97",
        },
        {
          id: 60,
          first_name: "Friedrick",
          last_name: "Gunther",
          email: "fgunther1n@google.es",
          gender: "Male",
          ip_address: "21.77.218.100",
          Date_transaction: "11/10/2020",
          Color: "Red",
          passcode: "YfC5DmCB880",
          Job: "Geological Engineer",
          "Stock Name": "Camtek Ltd.",
          Amount: "$139525.12",
        },
        {
          id: 61,
          first_name: "Cordell",
          last_name: "Gullam",
          email: "cgullam1o@xing.com",
          gender: "Male",
          ip_address: "189.105.135.127",
          Date_transaction: "08/27/2019",
          Color: "Khaki",
          passcode: "cPRkZiG4929",
          Job: "Professor",
          "Stock Name": "Fenix Parts, Inc.",
          Amount: "$879544.32",
        },
        {
          id: 62,
          first_name: "Mord",
          last_name: "Eddington",
          email: "meddington1p@cisco.com",
          gender: "Male",
          ip_address: "214.72.209.218",
          Date_transaction: "03/06/2020",
          Color: "Aquamarine",
          passcode: "ZsiYB5yP796",
          Job: "Software Consultant",
          "Stock Name": "Union Pacific Corporation",
          Amount: "$39472.60",
        },
        {
          id: 63,
          first_name: "Kristan",
          last_name: "Dayley",
          email: "kdayley1q@example.com",
          gender: "Female",
          ip_address: "136.175.79.80",
          Date_transaction: "08/14/2021",
          Color: "Teal",
          passcode: "mEuUO93P123",
          Job: "Analyst Programmer",
          "Stock Name": "Corporate Asset Backed Corp CABCO",
          Amount: "$990722.03",
        },
        {
          id: 64,
          first_name: "Tomasina",
          last_name: "Colwell",
          email: "tcolwell1r@nbcnews.com",
          gender: "Female",
          ip_address: "114.182.212.15",
          Date_transaction: "04/29/2020",
          Color: "Pink",
          passcode: "P6F2wgtw549",
          Job: "Legal Assistant",
          "Stock Name": "Helen of Troy Limited",
          Amount: "$973588.69",
        },
        {
          id: 65,
          first_name: "Lenee",
          last_name: "Haire",
          email: "lhaire1s@moonfruit.com",
          gender: "Female",
          ip_address: "176.232.133.184",
          Date_transaction: "06/13/2021",
          Color: "Red",
          passcode: "nKgcwCC5977",
          Job: "Human Resources Manager",
          "Stock Name": "Automatic Data Processing, Inc.",
          Amount: "$828693.11",
        },
        {
          id: 66,
          first_name: "Dirk",
          last_name: "Tetley",
          email: "dtetley1t@si.edu",
          gender: "Male",
          ip_address: "55.125.28.206",
          Date_transaction: "03/14/2021",
          Color: "Yellow",
          passcode: "rNACdiuE403",
          Job: "Physical Therapy Assistant",
          "Stock Name": "Raven Industries, Inc.",
          Amount: "$257638.78",
        },
        {
          id: 67,
          first_name: "Babbie",
          last_name: "Brachell",
          email: "bbrachell1u@blogtalkradio.com",
          gender: "Female",
          ip_address: "10.162.43.219",
          Date_transaction: "05/06/2020",
          Color: "Blue",
          passcode: "UT5CK3Dc316",
          Job: "Senior Quality Engineer",
          "Stock Name": "BlackRock 2022 Global Income Opportunity Trust",
          Amount: "$875288.20",
        },
        {
          id: 68,
          first_name: "Giraldo",
          last_name: "Arnow",
          email: "garnow1v@unesco.org",
          gender: "Male",
          ip_address: "244.17.114.127",
          Date_transaction: "03/03/2019",
          Color: "Violet",
          passcode: "Pj42dInM675",
          Job: "Senior Editor",
          "Stock Name": "HD Supply Holdings, Inc.",
          Amount: "$926148.58",
        },
        {
          id: 69,
          first_name: "Pippo",
          last_name: "Swannie",
          email: "pswannie1w@google.ru",
          gender: "Male",
          ip_address: "211.120.5.95",
          Date_transaction: "10/28/2022",
          Color: "Mauv",
          passcode: "biiAcE8Z459",
          Job: "Junior Executive",
          "Stock Name": "The Bancorp, Inc.",
          Amount: "$973770.94",
        },
        {
          id: 70,
          first_name: "Avrit",
          last_name: "Bellward",
          email: "abellward1x@answers.com",
          gender: "Female",
          ip_address: "214.220.120.122",
          Date_transaction: "01/18/2019",
          Color: "Purple",
          passcode: "EfA8aNg9925",
          Job: "Software Engineer III",
          "Stock Name": "Protagonist Therapeutics, Inc.",
          Amount: "$568964.02",
        },
        {
          id: 71,
          first_name: "Ly",
          last_name: "Harwin",
          email: "lharwin1y@latimes.com",
          gender: "Male",
          ip_address: "128.66.174.171",
          Date_transaction: "08/30/2019",
          Color: "Puce",
          passcode: "AlACSLv5025",
          Job: "Professor",
          "Stock Name": "Novo Nordisk A/S",
          Amount: "$750820.09",
        },
        {
          id: 72,
          first_name: "Selie",
          last_name: "Paulot",
          email: "spaulot1z@eventbrite.com",
          gender: "Female",
          ip_address: "169.185.236.188",
          Date_transaction: "11/26/2018",
          Color: "Puce",
          passcode: "mS53ogLo319",
          Job: "Business Systems Development Analyst",
          "Stock Name": "Altisource Residential Corporation",
          Amount: "$748291.95",
        },
        {
          id: 73,
          first_name: "Bruis",
          last_name: "Pristnor",
          email: "bpristnor20@cornell.edu",
          gender: "Male",
          ip_address: "71.157.95.92",
          Date_transaction: "10/28/2019",
          Color: "Indigo",
          passcode: "qj04fBoR243",
          Job: "VP Marketing",
          "Stock Name": "Diana Containerships Inc.",
          Amount: "$481169.59",
        },
        {
          id: 74,
          first_name: "Brita",
          last_name: "Josifovitz",
          email: "bjosifovitz21@yelp.com",
          gender: "Female",
          ip_address: "223.51.94.245",
          Date_transaction: "11/26/2019",
          Color: "Maroon",
          passcode: "SvEi9eEL383",
          Job: "Statistician II",
          "Stock Name": "Applied DNA Sciences Inc",
          Amount: "$522298.19",
        },
        {
          id: 75,
          first_name: "Mike",
          last_name: "Watters",
          email: "mwatters22@usgs.gov",
          gender: "Male",
          ip_address: "50.186.168.36",
          Date_transaction: "08/24/2021",
          Color: "Teal",
          passcode: "yqV5e6Yg485",
          Job: "Technical Writer",
          "Stock Name": "New Residential Investment Corp.",
          Amount: "$613806.67",
        },
        {
          id: 76,
          first_name: "Ernestine",
          last_name: "Greyes",
          email: "egreyes23@blog.com",
          gender: "Female",
          ip_address: "111.1.79.0",
          Date_transaction: "07/30/2021",
          Color: "Yellow",
          passcode: "bVWDnDmX052",
          Job: "VP Quality Control",
          "Stock Name": "Oil States International, Inc.",
          Amount: "$193896.39",
        },
        {
          id: 77,
          first_name: "Guglielmo",
          last_name: "Tirrey",
          email: "gtirrey24@exblog.jp",
          gender: "Male",
          ip_address: "236.156.112.67",
          Date_transaction: "06/06/2021",
          Color: "Violet",
          passcode: "CrBXjICv278",
          Job: "Pharmacist",
          "Stock Name": "Cytokinetics, Incorporated",
          Amount: "$578696.33",
        },
        {
          id: 78,
          first_name: "Eba",
          last_name: "Pippin",
          email: "epippin25@mysql.com",
          gender: "Female",
          ip_address: "81.122.212.236",
          Date_transaction: "03/03/2019",
          Color: "Blue",
          passcode: "ES8aRLlW654",
          Job: "Research Assistant IV",
          "Stock Name": "First Foundation Inc.",
          Amount: "$229025.97",
        },
        {
          id: 79,
          first_name: "Shanta",
          last_name: "Renyard",
          email: "srenyard26@pcworld.com",
          gender: "Female",
          ip_address: "50.118.95.39",
          Date_transaction: "07/22/2021",
          Color: "Blue",
          passcode: "dEHMD84i307",
          Job: "Staff Accountant I",
          "Stock Name": "GW Pharmaceuticals Plc",
          Amount: "$602347.52",
        },
      ],
      selectedColumns: "",
      selectedColumnsToSort: [],
      showFilterModal: false,
      filterData: {},
    };
  },
};
</script>

<style scoped>
.selected {
  background-color: #9abbdd;
  color: #fff;
}
td.headers:hover {
  background-color: #ddeaf7;
}
tr.records:hover {
  background-color: #f8f8f8c7;
}
i:hover {
  color: #000000c7 !important;
}
</style>
