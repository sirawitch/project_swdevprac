const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const arttoysController = require('../controllers/arttoys');

/**
 * @swagger
 * tags:
 *   name: Art Toys
 *   description: Art Toy management API endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArtToy:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - description
 *         - arrivalDate
 *         - availableQuota
 *         - posterPicture
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           readOnly: true
 *         sku:
 *           type: string
 *           description: Stock Keeping Unit of the art toy
 *         name:
 *           type: string
 *           description: Name of the art toy
 *         description:
 *           type: string
 *           description: Detailed description of the art toy
 *         arrivalDate:
 *           type: string
 *           format: date
 *           description: Expected arrival date
 *         availableQuota:
 *           type: integer
 *           minimum: 0
 *           description: Available quantity for pre-order
 *         posterPicture:
 *           type: string
 *           description: URL of the art toy's poster picture
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated timestamp of creation
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated timestamp of last update
 *           readOnly: true
 */

/**
 * @swagger
 * /arttoys:
 *   get:
 *     summary: Get all art toys
 *     description: Retrieve all available art toys. Accessible by all users.
 *     tags: [Art Toys]
 *     responses:
 *       200:
 *         description: List of art toys
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ArtToy'
 *       500:
 *         description: Server error
 *   
 *   post:
 *     summary: Create a new art toy
 *     description: Create a new art toy. Only accessible by admin users. Arrival date must not be earlier than current date.
 *     tags: [Art Toys]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtToy'
 *     responses:
 *       201:
 *         description: Art toy created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ArtToy'
 *       400:
 *         description: Invalid input or arrival date is in the past
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /arttoys/{id}:
 *   get:
 *     summary: Get an art toy by ID
 *     description: Retrieve details of a specific art toy. Accessible by all users.
 *     tags: [Art Toys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Art toy ID
 *     responses:
 *       200:
 *         description: Art toy details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ArtToy'
 *       404:
 *         description: Art toy not found
 *   
 *   put:
 *     summary: Update an art toy
 *     description: Update an existing art toy. Only accessible by admin users.
 *     tags: [Art Toys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Art toy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArtToy'
 *     responses:
 *       200:
 *         description: Art toy updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/ArtToy'
 *       400:
 *         description: Invalid input or arrival date is in the past
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Art toy not found
 *   
 *   delete:
 *     summary: Delete an art toy
 *     description: Delete an art toy. Only accessible by admin users.
 *     tags: [Art Toys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Art toy ID
 *     responses:
 *       200:
 *         description: Art toy deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Art toy not found
 */

// Routes for /api/v1/arttoys
router.route('/')
  .get(arttoysController.getArtToys)
  .post(protect, authorize('admin'), arttoysController.createArtToy);

router.route('/:id')
  .get(arttoysController.getArtToy)
  .put(protect, authorize('admin'), arttoysController.updateArtToy)
  .delete(protect, authorize('admin'), arttoysController.deleteArtToy);

module.exports = router;
