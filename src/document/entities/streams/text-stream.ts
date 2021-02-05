import { StreamType } from "../../common/const";
import { ParseInfo, ParseResult } from "../../parser/data-parser";
import { PdfStream } from "../core/pdf-stream";

export class TextStream extends PdfStream {
  
  constructor(type: StreamType = null) {
    super(type);
  }  

  static parse(parseInfo: ParseInfo): ParseResult<TextStream> {    
    const trailer = new TextStream();
    const parseResult = trailer.tryParseProps(parseInfo);

    return parseResult
      ? {value: trailer, start: parseInfo.bounds.start, end: parseInfo.bounds.end}
      : null;
  }
  
  getText(): string {
    // TODO: implement
    return null;
  }

  toArray(): Uint8Array {
    // TODO: implement
    return new Uint8Array();
  }

  /**
   * fill public properties from data using info/parser if available
   */
  protected tryParseProps(parseInfo: ParseInfo): boolean {
    const superIsParsed = super.tryParseProps(parseInfo);
    if (!superIsParsed) {
      return false;
    }

    return true;
  }
}