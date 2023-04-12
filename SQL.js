import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("RunDb.db");

export const initial = function () {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE "Saved_Run" ("id"	INTEGER NOT NULL UNIQUE,"Distance"	TEXT NOT NULL,"Duration"	TEXT NOT NULL,"Pace"	TEXT NOT NULL,"Date"    TEXT NOT NULL,PRIMARY KEY("id" AUTOINCREMENT));',
        [],
        null,
        (_, error) => {
          console.error(error);
          reject(error);
        }
      );
      tx.executeSql(
        'CREATE TABLE "Path" ("id"	INTEGER NOT NULL UNIQUE,"Latitude"	REAL NOT NULL,"Longitude"	REAL NOT NULL,"RunId"	INTEGER NOT NULL,"number" INTEGER NOT NULL,PRIMARY KEY("id" AUTOINCREMENT));',
        [],
        null,
        (_, error) => {
          console.error(error);
          reject(error);
        }
      );
    });
    resolve();
  });
};

export const fetchOne = function (tablename, ID) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tablename} WHERE id = ?`,
        [ID],
        (_, result) => {
          const response = result.rows.item(0);

          resolve(response);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const fetchMany = function (tablename) {
  return new Promise((resolve, reject) => {
    let response = [];
    console.log(tablename);
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tablename}`,
        [],
        (_, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            response.push(result.rows.item(i));
          }
          resolve(response);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const updateOne = function (tablename, ID, dataArray) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE ${tablename} SET ${Object.keys(dataArray)
          .map((key) => `${key} = ?`)
          .join(", ")} WHERE id = ?`,
        [...Object.values(dataArray), ID],
        (_, result) => {
          resolve(result);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const deleteOne = function (tablename, ID) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM ${tablename} WHERE id = ?`,
        [ID],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const insertOne = function (tablename, dataArray) {
  const columns = Object.keys(dataArray).join(", ");
  const placeholders = Object.keys(dataArray)
    .map(() => "?")
    .join(", ");
  const insertQuery = `INSERT INTO ${tablename} (${columns}) VALUES (${placeholders})`;
  const insertValues = Object.values(dataArray);
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        insertValues,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const insertOrReplace = function (tablename, ID, dataArray) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO ${tablename} (${Object.keys(dataArray).join(
          ", "
        )}) VALUES (${Array(Object.keys(dataArray).length)
          .fill("?")
          .join(", ")})`,
        [...Object.values(dataArray), ID],
        (_, result) => {
          resolve(result);
        },
        (_, error) => reject(error)
      );
    });
  });
};

export const customQuery = function (query, data) {
  let response;

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        query,
        data,
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const clearDatabase = function () {
  const tableNames = [];
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT name FROM sqlite_master WHERE type="table" AND name != "sqlite_sequence"',
        [],
        (_, result) => {
          for (let i = 0; i < result.rows.length; i++) {
            tableNames.push(result.rows.item(i).name);
          }
          resolve();
        },
        (_, error) => {
          console.error(error);
          reject(error);
        }
      );
    });
  })
    .then(() => {
      db.transaction((tx) => {
        tableNames.forEach((tableName) => {
          tx.executeSql(
            `DROP TABLE ${tableName}`,
            [],
            (_, result) => {
              return true;
            },
            (_, error) => console.error(error)
          );
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
};
