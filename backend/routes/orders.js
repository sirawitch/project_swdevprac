const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const ordersController = require('../controllers/orders');

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: |
 *       Retrieve orders based on user role:
 *       - Admin users can view all orders
 *       - Member users can only view their own orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                       artToy:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           sku:
 *                             type: string
 *                           name:
 *                             type: string
 *                           description:
 *                             type: string
 *                           arrivalDate:
 *                             type: string
 *                             format: date-time
 *                           availableQuota:
 *                             type: integer
 *                       orderAmount:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server Error
 * 
 *   post:
 *     summary: Create a new order
 *     description: Create a new order for an art toy (member only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artToy
 *               - orderAmount
 *             properties:
 *               artToy:
 *                 type: string
 *                 description: ID of the art toy to order
 *               orderAmount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Number of items to order (1-5)
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     artToy:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         sku:
 *                           type: string
 *                         name:
 *                           type: string
 *                         description:
 *                           type: string
 *                         availableQuota:
 *                           type: integer
 *                     orderAmount:
 *                       type: integer
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request - Order amount must be between 1-5 or quota exceeded
 *       401:
 *         description: Not authorized - Member access required
 *       404:
 *         description: Art toy not found
 *       500:
 *         description: Server Error
 */

// Get all orders (admin) or own orders (member)
router.get('/', protect, ordersController.getOrders);

// Get single order by ID
router.get('/:id', protect, ordersController.getOrder);

// Create a new order (member only)
router.post('/', protect, authorize('member'), ordersController.createOrder);

// Delete an order (admin can delete any, member can only delete own orders)
router.delete('/:id', protect, ordersController.deleteOrder);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management API endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - artToy
 *         - orderAmount
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           readOnly: true
 *         user:
 *           type: string
 *           description: Reference to the user who placed the order
 *           readOnly: true
 *         artToy:
 *           type: string
 *           description: Reference to the art toy being ordered
 *         orderAmount:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Number of items ordered (1-5)
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
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID (admin can view any order, member can only view their own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to view
 *     responses:
 *       200:
 *         description: Returns the order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       
 *   put:
 *     summary: Update order (admin can update any order, member can only update their own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderAmount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: New order amount (1-5)
 *             required:
 *               - orderAmount
 *     responses:
 *       200:
 *         description: Order updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or quota exceeded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *   
 *   delete:
 *     summary: Delete order (admin can delete any order, member can only delete their own)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to delete
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */

// Get all orders (admin) or own orders (member)
router.get('/', protect, ordersController.getOrders);

// Get single order by ID
router.get('/:id', protect, ordersController.getOrder);

// Create a new order (member only)
router.post('/', protect, authorize('member'), ordersController.createOrder);


// Update an order (admin can update any, member can only update their own)
router.put('/:id', protect, ordersController.updateOrder);

// Delete an order (admin can delete any, member can only delete own orders)
router.delete('/:id', protect, ordersController.deleteOrder);

module.exports = router;

module.exports = router;
