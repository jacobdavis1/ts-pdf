import { Quadruple } from "../../../common/types";
import { codes } from "../../char-codes";
import { dictTypes } from "../../const";
import { CryptInfo } from "../../common-interfaces";
import { ParseInfo, ParseResult } from "../../data-parser";
import { ObjectId } from "../core/object-id";
import { PdfDict } from "../core/pdf-dict";

/**PDF document page tree object */
export class PageTreeDict extends PdfDict {
  /**
   * (Required except in root node; prohibited in the root node; 
   * shall be an indirect reference) The page tree node that is the immediate parent of this one
   */
  Parent: ObjectId;
  /**
   * (Required) An array of indirect references to the immediate children of this node. 
   * The children shall only be page objects or other page tree nodes
   */
  Kids: ObjectId[];
  /**
   * (Required) The number of leaf nodes (page objects) 
   * that are descendants of this node within the page tree
   */
  Count: number;

  /**
   * (Optional; inheritable) A rectangle , expressed in default user space units, 
   * that shall define the boundaries of the physical medium 
   * on which the page shall be displayed or printed
   */
  MediaBox: Quadruple;
  /**
   * (Optional; inheritable) The number of degrees by which the page shall be rotated 
   * clockwise when displayed or printed. The value shall be a multiple of 90
   */
  Rotate = 0;
  
  constructor() {
    super(dictTypes.PAGE_TREE);
  }
  
  static parse(parseInfo: ParseInfo): ParseResult<PageTreeDict> {
    if (!parseInfo) {
      throw new Error("Parsing information not passed");
    }
    try {
      const pdfObject = new PageTreeDict();
      pdfObject.parseProps(parseInfo);
      return {value: pdfObject, start: parseInfo.bounds.start, end: parseInfo.bounds.end};
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }
  
  override toArray(cryptInfo?: CryptInfo): Uint8Array {
    const superBytes = super.toArray(cryptInfo);  
    const encoder = new TextEncoder();  
    const bytes: number[] = [];  

    if (this.Parent) {
      bytes.push(...encoder.encode("/Parent "), codes.WHITESPACE, ...this.Parent.toArray(cryptInfo));
    }
    if (this.Kids) {
      bytes.push(...encoder.encode("/Kids "), codes.L_BRACKET);
      this.Kids.forEach(x => bytes.push(codes.WHITESPACE, ...x.toArray(cryptInfo)));
      bytes.push(codes.R_BRACKET);
    }
    if (this.Count) {
      bytes.push(...encoder.encode("/Count "), ...encoder.encode(" " + this.Count));
    }
    if (this.MediaBox) {
      bytes.push(
        ...encoder.encode("/MediaBox "), codes.L_BRACKET, 
        ...encoder.encode(this.MediaBox[0] + ""), codes.WHITESPACE,
        ...encoder.encode(this.MediaBox[1] + ""), codes.WHITESPACE,
        ...encoder.encode(this.MediaBox[2] + ""), codes.WHITESPACE, 
        ...encoder.encode(this.MediaBox[3] + ""), codes.R_BRACKET,
      );
    }
    if (this.Rotate) {
      bytes.push(...encoder.encode("/Rotate "), ...encoder.encode(" " + this.Rotate));
    }

    const totalBytes: number[] = [
      ...superBytes.subarray(0, 2), // <<
      ...bytes, 
      ...superBytes.subarray(2, superBytes.length)];
    return new Uint8Array(totalBytes);
  }
  
  protected override parseProps(parseInfo: ParseInfo) {
    super.parseProps(parseInfo);
    const {parser, bounds} = parseInfo;
    const start = bounds.contentStart || bounds.start;
    const end = bounds.contentEnd || bounds.end; 
    
    let i = parser.skipToNextName(start, end - 1);
    let name: string;
    let parseResult: ParseResult<string>;
    while (true) {
      parseResult = parser.parseNameAt(i);
      if (parseResult) {
        i = parseResult.end + 1;
        name = parseResult.value;
        switch (name) {
          case "/Parent":            
            i = this.parseRefProp(name, parser, i);
            break;
            
          case "/Kids":            
            i = this.parseRefArrayProp(name, parser, i);
            break;
            
          case "/Count":
          case "/Rotate":
            i = this.parseNumberProp(name, parser, i, false);
            break;

          case "/MediaBox":
            i = this.parseNumberArrayProp(name, parser, i, true);
            break;
            
          default:
            // skip to next name
            i = parser.skipToNextName(i, end - 1);
            break;
        }
      } else {
        break;
      }
    };

    if (!this.Kids || isNaN(this.Count)) {
      throw new Error("Not all required properties parsed");
    }
  }
}
