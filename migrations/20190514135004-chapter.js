

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.addColumn(
        'Level',
        'chapterId',
        Sequelize.INTEGER,
    ).then(() => queryInterface.addConstraint('Level', ['chapterId'], {
        type: 'FOREIGN KEY',
        name: 'FK_chapter_level', // useful if using queryInterface.removeConstraint
        references: {
            table: 'Chapter',
            field: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    })),

    down: (queryInterface, Sequelize) => queryInterface.removeColumn(
        'Level',
        'chapterId',
    ),
};
