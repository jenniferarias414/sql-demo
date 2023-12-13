require('dotenv').config() //configuring environment to use variables
const {CONNECTION_STRING} = process.env //processing the envir variables
const Sequelize = require('sequelize') //this class is how we connect to a db
const sequelize = new Sequelize(CONNECTION_STRING)

const userId = 4
const clientId = 3

module.exports = {
    getUserInfo: (req, res) => {
        sequelize.query(`
        SELECT * FROM cc_clients AS c
        JOIN cc_users AS u
        ON c.user_id = u.user_id
        WHERE u.user_id = ${userId};
        `).then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => console.error(err))
    },

    updateUserInfo: (req, res) => {
        let {
            firstName,
            lastName,
            phoneNumber,
            email,
            address,
            city,
            state,
            zipCode
        } = req.body

        sequelize.query(`
        UPDATE cc_users SET first_name = '${firstName}',
        last_name = '${lastName}',
        email = '${email}',
        phone_number = ${phoneNumber}
        WHERE user_id = ${userId};

        UPDATE cc_clients SET address = '${address}',
        city = '${city}',
        state = '${state}',
        zip_code = ${zipCode}
        WHERE user_id = ${userId};
        `).then(() => res.sendStatus(200))
        .catch((err) => console.error(err))
    },

    getUserAppt: (req, res) => {
        sequelize.query(`
        SELECT * FROM cc_appointments
        WHERE client_id = ${clientId}
        ORDER BY date DESC;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch((err) => console.error(err))
    },

    requestAppointment: (req, res) => {
        const {date, service} = req.body

        sequelize.query(`
        INSERT INTO cc_appointments (client_id, date, service_type, notes, approved, completed)
        VALUES (
            ${clientId},
            '${date}',
            '${service}',
            '',
            false,
            false
        )
        RETURNING *;
        `).then(dbRes => res.status(200).send(dbRes[0]))
        .catch((err) => console.error(err))
    }
}