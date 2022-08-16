//following code is based on original java impl.
var uint2consonant = [
  'b', 'd', 'f', 'g',
  'h', 'j', 'k', 'l',
  'm', 'n', 'p', 'r',
  's', 't', 'v', 'z'
];

var uint2vowel = [
  'a', 'i', 'o', 'u'
];


var MASK_FIRST4 = 0xF0000000;
var MASK_FIRST2 = 0xC0000000;

export function uint2quint(i) {
  var j;
  var quint="";
  
  j = i & MASK_FIRST4; i <<= 4; j >>>= 28; quint+=(uint2consonant[j]);
  j = i & MASK_FIRST2; i <<= 2; j >>>= 30; quint+=(uint2vowel[j]);
  j = i & MASK_FIRST4; i <<= 4; j >>>= 28; quint+=(uint2consonant[j]);
  j = i & MASK_FIRST2; i <<= 2; j >>>= 30; quint+=(uint2vowel[j]);
  j = i & MASK_FIRST4; i <<= 4; j >>>= 28; quint+=(uint2consonant[j]);

  quint+="-";

  j = i & MASK_FIRST4; i <<= 4; j >>>= 28; quint+=(uint2consonant[j]);
  j = i & MASK_FIRST2; i <<= 2; j >>>= 30; quint+=(uint2vowel[j]);
  j = i & MASK_FIRST4; i <<= 4; j >>>= 28; quint+=(uint2consonant[j]);
  j = i & MASK_FIRST2; i <<= 2; j >>>= 30; quint+=(uint2vowel[j]);
  j = i & MASK_FIRST4; i <<= 4; j >>>= 28; quint+=(uint2consonant[j]);
  return quint;
}

export function quint2uint(quint) {
  var res = 0;
  var remaining = quint.length;
  var i=0;
  while(remaining>0) {
    var c=quint[i++];
    remaining --; 
    switch(c) {

      /* consonants */
    case 'b': res <<= 4; res +=  0; break;
    case 'd': res <<= 4; res +=  1; break;
    case 'f': res <<= 4; res +=  2; break;
    case 'g': res <<= 4; res +=  3; break;

    case 'h': res <<= 4; res +=  4; break;
    case 'j': res <<= 4; res +=  5; break;
    case 'k': res <<= 4; res +=  6; break;
    case 'l': res <<= 4; res +=  7; break;

    case 'm': res <<= 4; res +=  8; break;
    case 'n': res <<= 4; res +=  9; break;
    case 'p': res <<= 4; res += 10; break;
    case 'r': res <<= 4; res += 11; break;

    case 's': res <<= 4; res += 12; break;
    case 't': res <<= 4; res += 13; break;
    case 'v': res <<= 4; res += 14; break;
    case 'z': res <<= 4; res += 15; break;

      /* vowels */
    case 'a': res <<= 2; res +=  0; break;
    case 'i': res <<= 2; res +=  1; break;
    case 'o': res <<= 2; res +=  2; break;
    case 'u': res <<= 2; res +=  3; break;

      /* separators */
    default: break;
    }
  }
  return res>>>0; //the unsigned right shift fixes signed int issue - http://stackoverflow.com/a/17106974/1777150 
}

