import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GenerateImageForm.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const apiUrl = process.env.REACT_APP_API_URL;

const translations = {
  en: {
    width: "Width",
    height: "Height",
    scale: "Scale",
    steps: "Steps",
    seed: "Seed",
    inputPrompt: "Input Prompt",
    negativePrompt: "Negative Prompt",
    sm: "SM",
    smDyn: "SM Dyn",
    uploadImage: "Upload Image",
    strength: "Strength",
    noise: "Noise",
    batchGeneration: "Batch Generation",
    batchSize: "Batch Size",
    batchInterval: "Batch Interval (ms)",
    generateImage: "Generate Image",
    testFlask: "Test Flask",
    progress: "Progress",
    elapsedTime: "Elapsed Time",
    estimatedTime: "Estimated Time",
    saveImage: "Save Image",
    saveAllImages: "Save All Images",
    clearHistory: "Clear History",
    switchLanguage: "Switch Language"
  },
  cn: {
    width: "宽度",
    height: "高度",
    scale: "比例",
    steps: "步数",
    seed: "种子",
    inputPrompt: "输入提示",
    negativePrompt: "负面提示",
    sm: "SM",
    smDyn: "SM 动态",
    uploadImage: "上传图片",
    strength: "强度",
    noise: "噪声",
    batchGeneration: "批量生成",
    batchSize: "批量大小",
    batchInterval: "批量间隔 (毫秒)",
    generateImage: "生成图片",
    testFlask: "测试 Flask",
    progress: "进度",
    elapsedTime: "已用时间",
    estimatedTime: "预计时间",
    saveImage: "保存图片",
    saveAllImages: "保存所有图片",
    clearHistory: "清空历史",
    switchLanguage: "切换语言"
  }
};

function GenerateImageForm() {
  const [language, setLanguage] = useState('en');
  const [width, setWidth] = useState(832);
  const [height, setHeight] = useState(1216);
  const [scale, setScale] = useState(5);
  const [steps, setSteps] = useState(28);
  const [sm, setSm] = useState(true);
  const [smDyn, setSmDyn] = useState(false);
  const [seed, setSeed] = useState('');
  const [inputPrompt, setInputPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [originalImageBase64, setOriginalImageBase64] = useState('');
  const [strength, setStrength] = useState(0.5);
  const [noise, setNoise] = useState(0);
  const [batchSize, setBatchSize] = useState(1);
  const [batchInterval, setBatchInterval] = useState(1000); // in milliseconds
  const [isBatch, setIsBatch] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleWidthChange = (e) => {
    setWidth(e.target.value);
  };

  const handleHeightChange = (e) => {
    setHeight(e.target.value);
  };

  const handleScaleChange = (e) => {
    setScale(e.target.value);
  };

  const handleStepsChange = (e) => {
    setSteps(e.target.value);
  };

  const handleSmChange = () => {
    setSm(!sm);
  };

  const handleSmDynChange = () => {
    setSmDyn(!smDyn);
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
  };

  const handleInputPromptChange = (e) => {
    setInputPrompt(e.target.value);
  };

  const handleNegativePromptChange = (e) => {
    setNegativePrompt(e.target.value);
  };

  const handlePresetClick = (preset) => {
    if (preset === 'horizontal') {
      setWidth(1216);
      setHeight(832);
    } else if (preset === 'square') {
      setWidth(1024);
      setHeight(1024);
    } else if (preset === 'vertical') {
      setWidth(832);
      setHeight(1216);
    }
    setMessage('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageBase64(reader.result.split(',')[1]);
        setPreviewImage(reader.result);
        setSm(false);
        setSmDyn(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImageBase64(reader.result.split(',')[1]);
        setPreviewImage(reader.result);
        setSm(false);
        setSmDyn(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setOriginalImageBase64('');
    setStrength(0.5);
    setNoise(0);
    setSm(true);
    setSmDyn(false);
  };

  const handleStrengthChange = (e) => {
    setStrength(e.target.value);
  };

  const handleNoiseChange = (e) => {
    setNoise(e.target.value);
  };

  const handleBatchSizeChange = (e) => {
    setBatchSize(e.target.value);
  };

  const handleBatchIntervalChange = (e) => {
    setBatchInterval(e.target.value);
  };

  const handleIsBatchChange = () => {
    setIsBatch(!isBatch);
  };

  const sendRequest = async (requestData) => {
    try {
      const response = await axios.post(`${apiUrl}/generate-image`, requestData, {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'blob'
      });

      if (response.status === 200) {
        const url = URL.createObjectURL(new Blob([response.data]));
        setImage(url);
        setImageBlob(response.data);
        setHistory((prev) => [{ url, blob: response.data, seed: requestData.parameters.seed, input: requestData.input }, ...prev]);
        setMessage('Image generated successfully!');
        return true;
      } else {
        const errorMessage = await response.data.text();
        console.error('Error generating image:', errorMessage);
        setMessage(`Error: ${response.data.error} (Status: ${response.data.status_code})`);
        return false;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setMessage('An error occurred while generating the image.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validWidth = Math.floor(width / 64) * 64;
    let validHeight = Math.floor(height / 64) * 64;

    if (validWidth * validHeight > 1048576) {
      setMessage('Width and Height product exceeds 1048576. Please adjust values.');
      return;
    }

    const finalSeed = seed ? parseInt(seed, 10) : Math.floor(Math.random() * 9999999999) + 1;
    const requestData = {
      input: `${inputPrompt}, best quality, amazing quality, very aesthetic, absurdres`,
      model: "nai-diffusion-3",
      action: previewImage ? "img2img" : "generate",
      parameters: {
        params_version: 1,
        width: validWidth,
        height: validHeight,
        scale: parseFloat(scale),
        sampler: "k_dpmpp_sde",
        steps: parseInt(steps, 10),
        n_samples: 1,
        strength: parseFloat(strength),
        noise: parseFloat(noise),
        ucPreset: 0,
        qualityToggle: true,
        sm: false,
        sm_dyn: false,
        dynamic_thresholding: false,
        controlnet_strength: 1,
        legacy: false,
        add_original_image: !!previewImage,
        uncond_scale: 1,
        cfg_rescale: 0,
        noise_schedule: "native",
        legacy_v3_extend: false,
        seed: finalSeed,
        extra_noise_seed: finalSeed,
        negative_prompt: `nsfw, lowres, {bad}, error, fewer, extra, missing, worst quality, jpeg artifacts, bad quality, watermark, unfinished, displeasing, chromatic aberration, signature, extra digits, artistic error, username, scan, [abstract], ${negativePrompt}`,
        reference_image_multiple: [],
        reference_information_extracted_multiple: [],
        reference_strength_multiple: []
      }
    };

    if (originalImageBase64) {
      requestData.parameters.image = originalImageBase64;
    }

    setLoading(true);
    setMessage('Generating image...');
    setProgress(0);
    setStartTime(new Date());
    setElapsedTime(0);

    if (isBatch) {
      for (let i = 0; i < batchSize; i++) {
        if (i > 0) {
          requestData.parameters.seed = Math.floor(Math.random() * 9999999999) + 1;
          requestData.parameters.extra_noise_seed = requestData.parameters.seed;
        }
        const success = await sendRequest(requestData);
        if (!success) break;
        setProgress(((i + 1) / batchSize) * 100);
        if (i < batchSize - 1) {
          await new Promise(resolve => setTimeout(resolve, batchInterval));
        }
      }
    } else {
      await sendRequest(requestData);
    }

    const endTime = new Date();
    setEstimatedTime((endTime - startTime) * batchSize);
    setLoading(false);
  };

  const handleTest = async () => {
    try {
      const response = await axios.get(`${apiUrl}/test`);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error testing Flask:', error);
      setMessage('An error occurred while testing Flask.');
    }
  };

  const handleSaveImage = () => {
    if (imageBlob) {
      const link = document.createElement('a');
      const seedStr = seed ? seed : 'random';
      const inputStr = inputPrompt ? inputPrompt.replace(/\s+/g, '_') : 'prompt';
      link.href = URL.createObjectURL(imageBlob);
      link.download = `${seedStr}-${inputStr}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSaveAllImages = async () => {
    const zip = new JSZip();
    history.forEach((item, index) => {
      const seedStr = item.seed ? item.seed : 'random';
      const inputStr = item.input ? item.input.replace(/\s+/g, '_') : 'prompt';
      zip.file(`${seedStr}-${inputStr}.png`, item.blob);
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "generated_images.zip");
  };

  const switchLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'cn' : 'en'));
  };

  const handleHistoryClick = (item) => {
    setImage(item.url);
    setImageBlob(item.blob);
  };

  return (
    <div className="generate-image-form" onDrop={handleDrop} onDragOver={handleDragOver}>
      <button className="language-button" onClick={switchLanguage}>{translations[language].switchLanguage}</button>
      <div className="input-side">
        <form onSubmit={handleSubmit}>
          <div>
            <label>{translations[language].width}: </label>
            <input type="number" value={width} onChange={handleWidthChange} onBlur={() => setWidth(Math.floor(width / 64) * 64)} />
          </div>
          <div>
            <label>{translations[language].height}: </label>
            <input type="number" value={height} onChange={handleHeightChange} onBlur={() => setHeight(Math.floor(height / 64) * 64)} />
          </div>
          <div className="preset-buttons">
            <button type="button" onClick={() => handlePresetClick('horizontal')}>{translations[language].width}</button>
            <button type="button" onClick={() => handlePresetClick('square')}>{translations[language].width}</button>
            <button type="button" onClick={() => handlePresetClick('vertical')}>{translations[language].width}</button>
          </div>
          <div>
            <label>{translations[language].scale}: </label>
            <input type="number" step="0.1" min="0" max="10" value={scale} onChange={handleScaleChange} />
          </div>
          <div>
            <label>{translations[language].steps}: </label>
            <input type="number" min="1" max="28" value={steps} onChange={handleStepsChange} />
          </div>
          <div>
            <label>{translations[language].seed}: </label>
            <input type="number" value={seed} onChange={handleSeedChange} placeholder="Leave blank for random seed" />
          </div>
          <div>
            <label>{translations[language].inputPrompt}: </label>
            <textarea value={inputPrompt} onChange={handleInputPromptChange} rows="3" cols="50" placeholder="Enter input prompt"></textarea>
          </div>
          <div>
            <label>{translations[language].negativePrompt}: </label>
            <textarea value={negativePrompt} onChange={handleNegativePromptChange} rows="3" cols="50" placeholder="Enter negative prompt"></textarea>
          </div>
          {!previewImage && (
            <>
              <div>
                <label>
                  <input type="checkbox" checked={sm} onChange={handleSmChange} /> {translations[language].sm}
                </label>
              </div>
              <div>
                <label>
                  <input type="checkbox" checked={smDyn} onChange={handleSmDynChange} /> {translations[language].smDyn}
                </label>
              </div>
            </>
          )}
          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          {previewImage && (
            <div className="preview">
              <img src={previewImage} alt="Preview" />
              <button type="button" onClick={handleRemoveImage}>X</button>
              <div>
                <label>{translations[language].strength}: </label>
                <input type="number" step="0.01" min="0" max="0.99" value={strength} onChange={handleStrengthChange} />
              </div>
              <div>
                <label>{translations[language].noise}: </label>
                <input type="number" step="0.01" min="0" max="0.99" value={noise} onChange={handleNoiseChange} />
              </div>
            </div>
          )}
          <div>
            <label>
              <input type="checkbox" checked={isBatch} onChange={handleIsBatchChange} /> {translations[language].batchGeneration}
            </label>
          </div>
          {isBatch && (
            <div>
              <div>
                <label>{translations[language].batchSize}: </label>
                <input type="number" min="1" value={batchSize} onChange={handleBatchSizeChange} />
              </div>
              <div>
                <label>{translations[language].batchInterval}: </label>
                <input type="number" min="0" value={batchInterval} onChange={handleBatchIntervalChange} />
              </div>
            </div>
          )}
          <button type="submit" disabled={loading || width * height > 1048576}>{translations[language].generateImage}</button>
          <button type="button" onClick={handleTest}>{translations[language].testFlask}</button>
        </form>
        {message && <p>{message}</p>}
        {loading && (
          <div>
            <progress value={progress} max="100"></progress>
            <span>{Math.floor(progress)}%</span>
            <p>{`${translations[language].progress}: ${Math.floor(progress / 100 * batchSize)} / ${batchSize}`}</p>
            <p>{`${translations[language].elapsedTime}: ${elapsedTime} seconds`}</p>
            <p>{`${translations[language].estimatedTime}: ${Math.floor((elapsedTime / progress) * (100 - progress))} seconds`}</p>
          </div>
        )}
      </div>
      <div className="output-side">
        {image && (
          <>
            <img src={image} alt="Generated" className="generated-image" />
            <button onClick={handleSaveImage}>{translations[language].saveImage}</button>
          </>
        )}
        <div className="history">
          <button onClick={handleSaveAllImages}>{translations[language].saveAllImages}</button>
          <button onClick={handleClearHistory}>{translations[language].clearHistory}</button>
          <div className="history-images">
            {history.map((item, index) => (
              <img key={index} src={item.url} alt={`Generated ${index + 1}`} onClick={() => handleHistoryClick(item)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateImageForm;
