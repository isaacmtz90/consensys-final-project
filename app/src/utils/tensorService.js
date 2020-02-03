import * as tf from '@tensorflow/tfjs';
import md5 from 'md5';
import {IMAGENET_CLASSES} from './imagenet_classes'

const IMAGE_SIZE = 224;
const TOPK_PREDICTIONS = 3;

async function loadModel (modelUrl){
  return tf.loadLayersModel(modelUrl)
}

async function hashData (imgElement){
  return md5(tf.browser.fromPixels(imgElement).toFloat());
}
async function predict(imgElement, model) {
  console.log('Predicting...');

  const logits = tf.tidy(
   function() {     
    const img = tf.browser.fromPixels(imgElement).toFloat();  
    const offset = tf.scalar(127.5);
    const normalized = img.sub(offset).div(offset);
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    return model.predict(batched);
    }
   );
  const classes = await getTopKClasses(logits, TOPK_PREDICTIONS);
  return classes;
};

async function getTopKClasses(logits, topK) {
  const values = await logits.data(); 
  const valuesAndIndices = [];
  for (let i = 0; i < values.length; i++) {
    valuesAndIndices.push({value: values[i], index: i});
  }
  valuesAndIndices.sort((a, b) => {
    return b.value - a.value;
  });
  const topkValues = new Float32Array(topK);
  const topkIndices = new Int32Array(topK);
  for (let i = 0; i < topK; i++) {
    topkValues[i] = valuesAndIndices[i].value;
    topkIndices[i] = valuesAndIndices[i].index;
  }

  const topClassesAndProbs = [];
  for (let i = 0; i < topkIndices.length; i++) {
    topClassesAndProbs.push({
      className: IMAGENET_CLASSES[topkIndices[i]],
      probability: topkValues[i]
    })
  }
  return topClassesAndProbs;
}

export {loadModel, predict, hashData}