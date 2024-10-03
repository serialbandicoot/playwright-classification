// Import the TensorFlow.js Node library
const tf = require('@tensorflow/tfjs-node');

// Create two tensors and perform addition
const a = tf.tensor([1, 2, 3]);
const b = tf.tensor([4, 5, 6]);

const result = a.add(b);

// Print the result to validate the installation
result.print();  // Expected output: Tensor [5, 7, 9]

console.log('TensorFlow.js Node is working correctly!');