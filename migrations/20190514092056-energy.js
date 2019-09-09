

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'Stats',
        'energy',
        Sequelize.INTEGER,
    ),

    down: (queryInterface, Sequelize) => queryInterface.removeColumn(
        'Stats',
        'energy',
    ),
};
