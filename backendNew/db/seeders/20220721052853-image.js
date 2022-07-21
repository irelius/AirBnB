'use strict';

const { Review, Image, Spot } = require("../models")

const images = [
  {
    imageableId: 1,
    reviewId: 1,
    url: "https://en.wikipedia.org/wiki/Ocean"
  },
  {
    imageableId: 1,
    spotId: 1,
    url: "https://en.wikipedia.org/wiki/Ocean"
  },
  {
    imageableId: 2,
    spotId: 2,
    url: "https://en.wikipedia.org/wiki/Mountain"
  },
  {
    imageableId: 3,
    reviewId: 3,
    url: "https://en.wikipedia.org/wiki/Beach"
  }
]

module.exports = {
  async up(queryInterface, Sequelize) {
    for (let image of images) {
      const { url, reviewId, spotId } = image
      let foundId;

      if (image.reviewId) {
        foundId = await Review.findByPk(image.reviewId)
        await Image.create({
          reviewId: foundId.id,
          url
        })

      }
      if (image.spotId) {
        foundId = await Spot.findByPk(image.spotId)
        await Image.create({
          spotId: foundId.id,
          url
        })
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Images", null, {});
  }
};
