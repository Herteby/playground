import {handleAddField, handleAddElement, handleAddReducer} from './createReducers';

/**
 * Embeds the reducer body with a collection body
 * @param reducerBody
 * @param collectionNode
 */
export default function embedReducerWithLink(reducerBody, collectionNode) {
    _.each(reducerBody, (value, key) => {
        const collection = collectionNode.collection;

        if (_.isObject(value)) {
            // nested field or link
            if (collectionNode.body[key]) {
                // if it exists
                const linker = collection.getLinker(key);

                // if it's a link
                if (linker) {
                    embedReducerWithLink(value, collectionNode.getCollectionNode(key));
                    return;
                }

                handleAddField(key, value, collectionNode);
            } else {
                // does not exist, so it may be a link/reducer/field
                handleAddElement(root, key, value);
            }
        } else {
            // if this field or other reducer exists within the collection

            if (!collectionNode.body[key]) {
                // can only be field or another reducer for this.
                const reducer = collection.getReducer(key);
                if (reducer) {
                    // if it's another reducer
                    return handleAddReducer(key, reducer, collectionNode);
                }

                return handleAddField(key, value, collectionNode);
            }
        }
    })
}