import { db } from "@/db";

export const login = async (username) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const query = `SELECT * FROM users WHERE username = ?;`;
      rows = db.prepare(query).all(username);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const newLogin = async (userid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const currentTimestamp = new Date();
      const query1 = `INSERT INTO logindetails (userid,
        logintime,
        logouttime) VALUES (?,?,?);`;

      const login = db
        .prepare(query1)
        .run(userid, currentTimestamp.toISOString(), "");
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const newLogout = async (userid) => {
  let rows;
  const transaction = db.transaction(() => {
    try {
      const currentTimestamp = new Date();
      const query = `UPDATE logindetails
      SET logouttime = '${currentTimestamp.toISOString()}'
      WHERE userid = ${userid}
      AND logindetailid = (
          SELECT MAX(logindetailid)
          FROM logindetails
          WHERE userid = ${userid}
      );`;
      // console.log("userid", userid, currentTimestamp.toISOString());
      db.prepare(query).run();
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};

export const getUserLoginDetails = async () => {
  let rows;
  const transaction = db.transaction(() => {
    const currentTimestamp = new Date();
    const year = currentTimestamp.getFullYear();
    const month = (currentTimestamp.getMonth() + 1).toString().padStart(2, "0");
    const day = currentTimestamp.getDate().toString().padStart(2, "0");
    const formattedItemDate = `${year}-${month}-${day}`;
    try {
      const query = `SELECT * FROM logindetails WHERE logintime LIKE ?;`;

      rows = db.prepare(query).all(`${formattedItemDate}%`);
    } catch (error) {
      console.error("Transaction error:", error);
    }
  });
  transaction();
  return rows;
};
