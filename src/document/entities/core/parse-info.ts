import { keywordCodes } from "../../common/codes";
import { ObjectType, objectTypes, valueTypes } from "../../common/const";
import { Parser, ParseResult } from "../../parser";
import { ObjectId } from "./object-id";

export class ParseInfo {
  constructor(readonly parser: Parser,
    readonly type: ObjectType, 
    readonly start: number, 
    readonly end: number,
    readonly contentStart: number, 
    readonly contentEnd: number,
    readonly dictStart?: number, 
    readonly dictEnd?: number,
    readonly streamStart?: number, 
    readonly streamEnd?: number) { }
    
  static parse(parser: Parser, index: number, 
    skipEmpty = true): ParseResult<ParseInfo> {
    if (skipEmpty) {
      index = parser.skipEmpty(index);
    }
    const objIndex = parser.findSubarrayIndex(keywordCodes.OBJ, 
      {minIndex: index, closedOnly: true});
    if (!objIndex || objIndex.start !== index) {
      return null;
    }    

    const startIndex = objIndex.end + 1;
    let type: ObjectType;
    let streamStart: number;
    let streamEnd: number;
    let dictStart: number;
    let dictEnd: number;

    const contentStart = parser.findNonSpaceIndex("straight", startIndex);
    if (contentStart === -1){
      return null;
    }
    
    const objEndIndex = parser.findSubarrayIndex(keywordCodes.OBJ_END, 
      {minIndex: startIndex, closedOnly: true});
    if (!objEndIndex) {
      return null;
    }
    const contentEnd = objEndIndex.start - 1;

    let lastIndex = contentEnd; 
    const dictStartIndex = parser.findSubarrayIndex(keywordCodes.DICT_START,
      {direction: "straight", minIndex: startIndex, closedOnly: true});
    if (dictStartIndex) {
      // dictionary found, so the object is a dictionary or a stream
      const streamEndIndex = parser.findSubarrayIndex(keywordCodes.STREAM_END, { 
        direction: "reverse", 
        minIndex: dictStartIndex.end + keywordCodes.DICT_END.length + keywordCodes.STREAM_START.length + 1, 
        maxIndex: lastIndex, 
        closedOnly: true
      });
      if (streamEndIndex) {      
        const streamStartIndex = parser.findSubarrayIndex(keywordCodes.STREAM_START, {
          direction: "reverse", 
          maxIndex: streamEndIndex.start - 1, 
          closedOnly: true
        });
        streamStart = parser.findNonSpaceIndex("straight", streamStartIndex.end + 1);
        streamEnd = parser.findNonSpaceIndex("reverse", streamEndIndex.start - 1);
        lastIndex = parser.findNonSpaceIndex("reverse", streamStartIndex.start - 1);
        // stream found, so the object is a stream
        type = objectTypes.STREAM;
      } else {
        // stream not found, so the object is a plain dictionary
        type = objectTypes.DICTIONARY;
      }
  
      const dictEndIndex = parser.findSubarrayIndex(keywordCodes.DICT_END, {
        direction: "reverse", 
        minIndex: dictStartIndex.end + 1, 
        maxIndex: lastIndex
      });  
      dictStart = dictStartIndex.end + 1;
      dictEnd = dictEndIndex.start - 1;    
    } else {
      // dictionary not found, so the object is not a dictionary or a stream
      const valueType = parser.getValueTypeAt(contentStart);
      switch (valueType) {
        case valueTypes.BOOLEAN:
        case valueTypes.NUMBER:
        case valueTypes.STRING_LITERAL:
        case valueTypes.STRING_HEX:
        case valueTypes.NAME:
        case valueTypes.ARRAY:
          type = valueType;
          break;
        case valueTypes.COMMENT:
          // not supposed to be here. should have been skipped.
          throw new Error("Error in info parser: COMMENT valueType");
        case valueTypes.DICTIONARY:
        case valueTypes.STREAM:
          // not supposed to be here. should have been handled before.
          throw new Error("Error in info parser: DICT or STREAM valueType");
        case valueTypes.REF:
        case valueTypes.NULL:
        case valueTypes.UNKNOWN:
          // unknown or incorrect object type.
          return null;
      }
    }    
    
    const info = new ParseInfo(parser, 
      type, objIndex.start, objEndIndex.end,
      contentStart, contentEnd, 
      dictStart, dictEnd, streamStart, streamEnd);

    return {
      value: info,
      start: objIndex.start,
      end: objEndIndex.end,
    };
  }
}