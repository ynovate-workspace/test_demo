/**
 * @description SnapShot class which manages snapshot array
 * @params void
 * @returns void
 */
class Snapshot {

    /**
     * @description Construction function
     * @params void
     * @returns void
     */
    constructor() {
        this.currentIndex = -1;  // Set to -1 since no snapshots have been added yet
        this.snapshotArray = [];
    }

    /**
     * @description Add snapshot function
     * @params ImageData snapshot
     * @returns void
     */
    addSnapshot = (snapshot) => {
        // When adding a new snapshot, we need to remove all snapshots after the current index, 
        // because the new snapshot creates a new "future".
        if (this.currentIndex < this.snapshotArray.length - 1) {
            this.snapshotArray.splice(this.currentIndex + 1);
        }
        this.snapshotArray.push(snapshot);
        this.currentIndex = this.snapshotArray.length - 1;  // Update currentIndex to point to the new snapshot
    }

    /**
     * @description get snapshot function
     * @params void
     * @returns Imagedata snapshot
     */
    getSnapshot = () => {
        // Here we simply retrieve the current snapshot
        return this.snapshotArray[this.currentIndex];
    }

    /**
     * @description undo function
     * @params void
     * @returns ImageData snapshot
     */
    undo = () => {
        this.currentIndex -= 1;   // Move one place back in the snapshot history
        return this.snapshotArray[this.currentIndex];
    }

    /**
     * @description undo possibility checking function
     * @params void
     * @returns bool
     */
    undoable = () => {
        return this.currentIndex > 0;
    }

    /**
     * @description Redo function
     * @params void
     * @returns ImageData snapshot
     */
    redo = () => {
        this.currentIndex += 1;   // Move one place forward in the snapshot history
        return this.snapshotArray[this.currentIndex];
    }

    /**
     * @description Redo possibility checking function
     * @params void
     * @returns bool
     */
    redoable = () => {
        return this.currentIndex < this.snapshotArray.length - 1;
    }
    /**
     * @description Array clear function
     * @params void
     * @returns void
     */
    clear = () => {
        this.currentIndex = -1;  // Set to -1 since no snapshots have been added yet
        this.snapshotArray = [];
    }

}

export default Snapshot;
