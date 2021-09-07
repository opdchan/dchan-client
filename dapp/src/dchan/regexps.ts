export const EXTERNAL_LINK_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/igm
export const BACKLINK_REGEX = />>(\d+)/gm
export const BACKLINK_HTML_SAFE_REGEX = /&gt;&gt;(\d+)/gm
export const SPOILER_REGEX = /\[spoiler\]((?:.|\s)*?)\[\/spoiler]/gm
export const REF_HTML_SAFE_REGEX = /&gt;&gt;(0[xX][0-9a-fA-F]+)/gm
export const REF_BOARD_HTML_SAFE_REGEX = /&gt;&gt;(\/([a-zA-Z]+)\/(0[xX][0-9a-fA-F]+)?)/gm
export const TEXT_QUOTES_HTML_SAFE_REGEX = /^&gt;(?!&gt;)(.*)$/gm
export const NEWLINE_REGEX = /\n/gm