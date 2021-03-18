/// <reference path="./assets.d.ts" />

export const styles = /*html*/`
<style>
  :host {
    --color-primary-final: var(--color-primary, rgba(40,40,40,1));
    --color-primary-tr-final: var(--color-primary-tr, rgba(40,40,40,0.9));
    --color-secondary-final: var(--color-secondary, rgba(60,60,60,1));
    --color-secondary-tr-final: var(--color-secondary-tr, rgba(60,60,60,0.9));
    --color-accent-final: var(--color-accent, rgba(96,96,96,1));
    --color-shadow-final: var(--color-shadow, rgba(0,0,0,0.75));
    --color-bg-final: var(--color-bg, rgba(128,128,128,1));
    --color-fg-primary-final: var(--color-fg-primary, rgba(255,255,255,1));
    --color-fg-secondary-final: var(--color-fg-secondary, rgba(187,187,187,1));
    --color-fg-accent-final: var(--color-fg-accent, rgba(255,255,255,1));
    --color-text-selection-final: var(--color-text-selection, rgba(104,104,128,0.3));
  }

  .disabled {
    pointer-events: none;
  }

  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .abs-stretch {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .abs-topleft {
    position: absolute;
    left: 0;
    top: 0;
  }
  .stretch {
    width: 100%;
    height: 100%;
  }
  
  .no-margin {
    margin: 0;
  }
  .no-padding {
    padding: 0;
  }
  .margin-s-5 {
    margin: 0 5px;
  }

  #main-container {
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;
    width: 100%;
    height: 100%;
    background: var(--color-bg-final);
  }

  #top-panel {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    width: 100%;
    height: 50px;
    background: var(--color-primary-final);
    box-shadow: 0 0 10px var(--color-shadow-final);
    z-index: 1;
    transition: height 0.25s ease-out 0.1s;
  }
  .hide-panels #top-panel {
    height: 0;
    transition: height 0.25s ease-in 0.2s;
  }

  #bottom-panel {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    left: calc(50% - 160px);
    bottom: 20px;
    width: 320px;
    height: 50px;  
    background: var(--color-primary-tr-final);
    box-shadow: 0 0 10px var(--color-shadow-final);
    z-index: 1;
    transition: height 0.25s ease-out, bottom 0.1s linear 0.25s;
  }
  .hide-panels #bottom-panel {
    bottom: 0;
    height: 0;
    transition: bottom 0.1s linear 0.1s, height 0.25s ease-in 0.2s;
  }
  
  #annotation-panel {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    flex-grow: 1;
    flex-shrink: 1;
    top: 80px;
    right: 20px;
    z-index: -5;
    transition: z-index 0s linear 0.25s;
  }
  .mode-annotation #annotation-panel {
    z-index: 1;
  }
  
  .annotation-panel-row {      
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
      align-items: center;
      flex-grow: 1;
      flex-shrink: 1;
    }

  .annotation-panel-item,
  :not(.annotation-selected) #button-annotation-delete {
    margin: 3px;
    cursor: default;      
    opacity: 0;
    background: var(--color-primary-tr-final);
    box-shadow: 0 0 10px var(--color-shadow-final);
    transform: scale(0);
    transition: opacity 0.1s ease-in, transform 0s linear 0.1s;
  }    
  .mode-annotation .annotation-panel-item,
  .annotation-selected #button-annotation-delete { 
    cursor: pointer;
    opacity: 100;
    transform: scale(1);    
    transition: opacity 0.1s ease-out 0.35s, transform 0s linear 0.35s;
  }

  .panel-v-separator {
    width: 1px;
    height: 30px;
    background-color: var(--color-fg-secondary-final);
  }

  .panel-button {
    cursor: pointer;
    user-select: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .panel-button:hover,
  .panel-button.on {
    background-color: var(--color-accent-final);
  }
  .panel-button img {
    width: 20px;
    height: 20px;
    filter: invert() opacity(0.5) drop-shadow(0 0 0 var(--color-fg-primary-final)) saturate(1000%);
  }  
  .panel-button:hover img,
  .panel-button.on img {
    filter: invert() opacity(0.5) drop-shadow(0 0 0 var(--color-fg-accent-final)) saturate(1000%);
  }
  
  .subpanel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0 4px;
  }    
  
  .panel-item {
    transform: scale(1);
    transition: opacity 0.1s ease-out 0.35s, transform 0s linear 0.35s;
  }
  .hide-panels .panel-item {
    cursor: default;      
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.1s ease-in, transform 0s linear 0.1s;
  }

  #paginator {  
    user-select: none;
    font-family: sans-serif;
    font-size: 16px;
    color: var(--color-fg-primary-final);
  }
  #paginator-input {
    text-align: center; 
    font-size: 16px;
    width: 30px;
    height: 30px;
    margin: 2px;
    padding: 0;
    outline: none;
    border: none;
    color: var(--color-fg-primary-final);
    background-color: var(--color-primary-final);
  }
  #paginator-total {
    margin: 4px;
  }

  #toggle-previewer {
    margin: 4px;
  }
    
  #previewer {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow-y: auto;
    left: 0;
    top: 50px;
    bottom: 0;
    width: 160px; 
    padding-top: 0px;
    background: var(--color-secondary-final);
    box-shadow: 0 0 10px var(--color-shadow-final);
    z-index: 1;
    transition: padding-top 0.25s ease-out 0.1s, top 0.25s ease-out 0.1s, width 0.25s ease-out;
  } 
  .hide-panels #previewer {
    top: 0;
    padding-top: 50px;
    transition: padding-top 0.25s ease-in 0.2s, top 0.25s ease-in 0.2s;
  }   
  .mobile #previewer {
    background: var(--color-secondary-tr-final);
  } 
  .hide-previewer #previewer {
    width: 0;
    transition: width 0.25s ease-in 0.1s;
  }
  #previewer .page-preview {      
    transform: scaleX(1);
    transition: opacity 0.1s ease-out 0.35s, transform 0s linear 0.35s;
  }
  .hide-previewer #previewer .page-preview {
    opacity: 0;
    transform: scaleX(0);
    transition: opacity 0.1s ease-in, transform 0s linear 0.1s;
  }

  #viewer {
    box-sizing: border-box;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: auto;
    left: 160px;
    right: 0;
    top: 50px;
    bottom: 0;
    padding-top: 0;
    transition: padding-top 0.25s ease-out 0.1s, top 0.25s ease-out 0.1s, left 0.25s ease-out;
  }
  .mode-hand #viewer {
    cursor: grab !important;
    user-select: none !important;
  }
  .hide-panels #viewer {
    top: 0;
    padding-top: 50px;
    transition: padding-top 0.25s ease-in 0.2s, top 0.25s ease-in 0.2s;
  }      
  .hide-panels.mobile #viewer,
  .hide-panels.hide-previewer #viewer {
    top: 0;
    padding-top: 50px;
    left: 0;
    transition: padding-top 0.25s ease-in 0.2s, top 0.25s ease-in 0.2s, left 0.25s ease-in;
  }   
  .mobile #viewer,
  .hide-previewer #viewer {
    top: 50px;
    padding-top: 0px;
    left: 0;
    transition: padding-top 0.25s ease-out 0.1s, top 0.25s ease-out 0.1s, left 0.25s ease-in;
  }
  
  #annotation-overlay-container {
    position: absolute;
    top: 0; 
    right: 0;
    bottom: 0;
    left: 0; 
    margin-top: 0;
    transition: margin-top 0.25s ease-out 0.1s;
  }
  .hide-panels #annotation-overlay-container {
    margin-top: 50px;
    transition: margin-top 0.25s ease-in 0.2s;
  }
  
  #annotation-overlay {
    position: absolute;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
  }

  .page {    
    position: relative;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    margin: 10px auto;
    background-color: white;
    box-shadow: 0 0 10px var(--color-shadow-final);
  }
  .page-preview {   
    cursor: pointer; 
    position: relative;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    margin: 0 auto;
    background-color: white;
    background-clip: content-box;
    border-style: solid;
    border-width: 10px 10px 20px 10px;
    border-color: transparent;
  }
  .page-preview:hover,
  .page-preview.current {
    border-color: var(--color-accent-final);
  }
  .page-preview::after {
    display: inline-block;
    position: absolute;
    top: calc(100% + 3px);
    width: 100%;
    text-align: center;
    font-family: sans-serif;
    font-size: 14px;
    line-height: 1;
    color: var(--color-fg-primary-final);
    content: attr(data-page-number) " ";
  }

  .page-canvas {
    background-color: white;
  } 
  
  .page-text {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
    line-height: 1;
  }
  .page-text span {
    cursor: text;
    position: absolute;
    white-space: pre;
    color: transparent;
    transform-origin: 0% 0%;
  }
  .page-text ::selection {
    background: var(--color-text-selection-final);
  }
  .mode-hand .page-text span {
    cursor: grab;
  }
  
  .page-annotations {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  .mode-text .page-annotations,
  .mode-hand .page-annotations {
    pointer-events: none;
  }
  
  #password-dialog {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: var(--color-secondary-tr-final);
    z-index: 2;
  }
  #password-dialog .form {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: stretch;
    align-items: stretch;
    flex-grow: 0;
    flex-shrink: 0;
    left: calc(50% - 160px);
    top: calc(50% - 25px);
    width: 320px;
    height: 50px;  
    background: var(--color-primary-tr-final);
    box-shadow: 0 0 10px var(--color-shadow-final);
  }
  #password-dialog input {
    width: 220px;
    margin: 10px 0 10px 10px;
    padding: 5px;
    font-size: 16px;
    outline: none;
    border: none;
    color: var(--color-fg-primary-final);
    background-color: var(--color-primary-final);
  }
  #password-dialog input::placeholder {
    font-size: 14px;
    font-style: italic;
    color: var(--color-fg-primary-final);
  }
  #password-dialog .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    flex-shrink: 1;
    width: 100px;
  } 

  .svg-annotation {
    cursor: pointer;
  }     
  .out .svg-annotation {
    cursor: not-allowed;
  }
  .svg-annot-rect,
  .svg-annot-box {
    fill: transparent;
  }
  .mode-annotation .svg-annotation.selected {
    cursor: grab;
  } 
  .mode-annotation .svg-annotation.selected .svg-annot-rect,
  .mode-annotation .svg-annotation.selected .svg-annot-box {
    stroke: var(--color-secondary-tr-final);
    stroke-dasharray: 3 3;
  } 
  .mode-annotation .svg-annotation.selected .svg-annot-handle-scale,
  .mode-annotation .svg-annotation.selected .svg-annot-handle-rotation {
    r: 8;
    fill: var(--color-primary-final);
    cursor: pointer;
  }
  .mode-annotation .svg-annotation.selected .svg-annot-rotation {
    fill: none;
    cursor: pointer;
  }
  .mode-annotation .svg-annotation.selected .svg-annot-rotation .circle {
    r: 25;
  }
  .mode-annotation .svg-annotation.selected .svg-annot-rotation .dashed {
    stroke: var(--color-secondary-tr-final);
    stroke-dasharray: 3 3;
  }
</style>
`;