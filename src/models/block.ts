export default class Block {
    block_id: number;
    block_title: string;
    block_text: string;

    constructor(blockId: number = null, blockTitle: string = null, blockText: string = null) {
        this.block_id = blockId;
        this.block_title = blockTitle;
        this.block_text = blockText;
    }
}