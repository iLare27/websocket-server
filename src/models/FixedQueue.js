class FixedQueue {
    constructor(limit) {
        this.limit = limit;
        this.queue = [];
    }

    enqueue(item) {
        if (this.queue.length >= this.limit) {
            this.queue.shift();
        }
        this.queue.push(item);
    }

    getItems() {
        return this.queue;
    }
}

module.exports = FixedQueue;
