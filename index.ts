const lineReader = require('line-reader');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const tuespath = 'Files/Tues.txt';
const eastpath = 'Files/East.txt';
const wedpath = 'Files/SouthWed.txt';
const thurspath = 'Files/Thurs.txt';
const fripath = 'Files/FriROB.txt';

// Date parsing, output filename crap.
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const n = new Date();
let month = n.getMonth() + 1;
if (month < 10) {
  month = '0' + month;
}
let day = n.getDate();
if (day < 10) {
  day = '0' + day;
}

let year = n.getFullYear().toString();
year = year.substring(year.length - 2);
const fullmonth = monthNames[n.getMonth()];
const writePath =
  month + day + year + fullmonth.toUpperCase() + 'SPREADSHEET.csv';

// Change the title based on the route
const csvWriter = createCsvWriter({
  path: writePath,
  header: [
    { id: 'name1', title: 'Tues' },
    { id: 'name2', title: 'East' },
    { id: 'name3', title: 'SouthWed' },
    { id: 'name4', title: 'Thurs' },
    { id: 'name5', title: 'FriROB' },
  ],
});

// This is where we'll store our stops.
const all = [];
const tues = [];
const east = [];
const wed = [];
const thurs = [];
const fri = [];
const promiseArr = [];

const getStops = (arr, nameparam, filepath) => {
  console.log(`${filepath} STOPS CALLED`);
  return new Promise((resolve) => {
    // Read each line in our Tuesday route.
    lineReader.eachLine(filepath, (line, last) => {
      try {
        // Key words that a stop is in a row, Depart, At, or Arrive

        // If the line has a stop in it, parse the line, get the stop and potential date, then save to an object and push to tues.
        const splitStr = line.split(' ');

        // We can calculate the end of the stop by looking for "on" at Depart and Arrive lines.
        if (
          splitStr[1] &&
          (splitStr[1].includes('Depart') ||
            splitStr[1].includes('At') ||
            splitStr[1].includes('Arrive'))
        ) {
          let name = splitStr[2];

          if (splitStr[3] && splitStr[3].includes(',')) {
            name = name + ' ' + splitStr[3];
            name = name.slice(0, -1);
          } else if (splitStr[4] && splitStr[4].includes(',')) {
            name = name + ' ' + splitStr[3] + ' ' + splitStr[4];
            name = name.slice(0, -1);
          } else if (splitStr[5] && splitStr[5].includes(',')) {
            name =
              name + ' ' + splitStr[3] + ' ' + splitStr[4] + ' ' + splitStr[5];
            name = name.slice(0, -1);
          }

          // Skip 4 because its probably another name or letter
          else if (splitStr[5] && splitStr[5].includes(',')) {
            name =
              name + ' ' + splitStr[3] + ' ' + splitStr[4] + ' ' + splitStr[5];
            name = name.slice(0, -1);
          } else if (splitStr[6] && splitStr[6].includes(',')) {
            name =
              name +
              ' ' +
              splitStr[3] +
              ' ' +
              splitStr[4] +
              ' ' +
              splitStr[5] +
              ' ' +
              splitStr[6];
            name = name.slice(0, -1);
          } else if (splitStr[7] && splitStr[7].includes(',')) {
            name =
              name +
              ' ' +
              splitStr[3] +
              ' ' +
              splitStr[4] +
              ' ' +
              splitStr[5] +
              ' ' +
              splitStr[6] +
              ' ' +
              splitStr[7];
            name = name.slice(0, -1);
            // }
          } else if (splitStr[8] && splitStr[8].includes(',')) {
            name =
              name +
              ' ' +
              splitStr[3] +
              ' ' +
              splitStr[4] +
              ' ' +
              splitStr[5] +
              ' ' +
              splitStr[6] +
              ' ' +
              splitStr[7] +
              ' ' +
              splitStr[8];

            console.log('LINE:', name);
            name = name.slice(0, -1);
          } else if (splitStr[9] && splitStr[9].includes(',')) {
            name =
              name +
              ' ' +
              splitStr[3] +
              ' ' +
              splitStr[4] +
              ' ' +
              splitStr[5] +
              ' ' +
              splitStr[6] +
              ' ' +
              splitStr[7] +
              ' ' +
              splitStr[8] +
              ' ' +
              splitStr[9];
            name = name.slice(0, -1);
          }

          if (name.slice(-1) === ',') {
            name = name.slice(0, -1);
          }

          const Obj = {};
          name = name.split('[')[0];

          Obj[nameparam] = name;
          arr.push(Obj);
        }

        if (last) {
          resolve();
        }
      } catch (error) {
        console.log('CAUGHT ERROR:', error);
      }
    });
  });
};

promiseArr.push(getStops(tues, 'name1', tuespath));
promiseArr.push(getStops(east, 'name2', eastpath));
promiseArr.push(getStops(wed, 'name3', wedpath));
promiseArr.push(getStops(thurs, 'name4', thurspath));
promiseArr.push(getStops(fri, 'name5', fripath));

Promise.all(promiseArr).then(() => {
  // After all lines are read and each route is pushed to an individual array.
  all.push(tues);
  all.push(east);
  all.push(wed);
  all.push(thurs);
  all.push(fri);

  // Find the largest length amongst our arrays.
  const lenIndex = all.reduce(
    (p, c, i, a) => (a[p].length > c.length ? p : i),
    0
  );

  // Save the length of the largest array to a variable.
  const maxLength = all[lenIndex].length;

  // This is what the csv writer will use for our final product.
  const finalArr = [];

  // For the longest array, add the other objects from the other arrays into 1 object.
  for (let i = 0; i < maxLength; i++) {
    const Obj = {};
    Obj.name1 = tues[i] && tues[i].name1 ? tues[i].name1 : '';
    Obj.name2 = east[i] && east[i].name2 ? east[i].name2 : '';
    Obj.name3 = wed[i] && wed[i].name3 ? wed[i].name3 : '';
    Obj.name4 = thurs[i] && thurs[i].name4 ? thurs[i].name4 : '';
    Obj.name5 = fri[i] && fri[i].name5 ? fri[i].name5 : '';
    finalArr.push(Obj);
  }

  // Once all of our files are uploaded and parsed to our all array, write the records.
  csvWriter
    .writeRecords(finalArr)
    .then(() => console.log('The CSV file was written successfully'));
});
