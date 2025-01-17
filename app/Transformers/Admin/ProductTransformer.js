'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const ImageTransformer = use('App/Transformers/Admin/ImageTransformer')
const SelectionTransformer = use('App/Transformers/Admin/SelectionTransformer')

/**
 * ProductTransformer class
 *
 * @class ProductTransformer
 * @constructor
 */
class ProductTransformer extends BumblebeeTransformer {
  static get defaultInclude () {
    return ['image', 'selections']
  }

  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      price: model.price,
    }
  }

  includeImage (model) {
    return this.item(model.getRelated('image'), ImageTransformer)
  }

  includeSelections (model) {
    return this.collection(model.getRelated('selections'), SelectionTransformer)
  }
}

module.exports = ProductTransformer
