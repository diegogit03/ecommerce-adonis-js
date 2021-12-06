'use strict'

const crypto = use('crypto')
const Helpers = use('Helpers')

/**
 * Generate random string
 *
 * @param { int } length - O tamanho da string que você quer gerar
 * @return { string } - uma string randomica do tamanho do length
 */
const str_random = async (length = 40) => {
  let string = ''
  let len = string.length

  if(len < length) {
    let size = length - len
    let bytes = await crypto.randomBytes(size)
    let buffer = Buffer.from(bytes)
    string += buffer
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substr(0, size)
  }

  return string
}

/**
 * Move um unico arquivo para o caminho especificado, se nenhum for especificado
 * então 'public/uploads' será utilizado.
 * @param { FileJar } file - o arquivo a ser gerenciado
 * @param { string } path - o caminho para onde o arquivo dever ser movido
 * @return { Object<FileJar> }
 */
const manage_single_upload = async (file, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')
  // gera um nome aleatorio
  const random_name = await str_random(30)
  let filename = `${new Date().getTime()}-${random_name}.${file.subtype}`

  // renomeia o arquivo e move ele para o path
  await file.move(path, {
    name: filename
  })

  return file
}

/**
 * Move multiplos arquivos para o caminho especificado, se nenhum for especificado
 * então 'public/uploads' será utilizado.
 * @param { FileJar } fileJar
 * @param { string } path
 * @return { Object }
 */
const manage_multiple_uploads = async (fileJar, path = null) => {
  path = path ? path : Helpers.publicPath('uploads')
  let success = [],
    errors = []

  await Promise.all(fileJar.files.map(async file => {
    let randomName = await str_random(30)
    let filename = `${new Date().getTime()}-${randomName}.${file.subtype}`
    // move o arquivo
    await file.move(path, {
      name: filename
    })

    // verificamos se moveu mesmo
    if(file.moved()) {
      success.push(file)
    } else {
      errors.push(file.error())
    }
  }))

  return { success, errors }
}

module.exports = {
  str_random,
  manage_single_upload,
  manage_multiple_uploads
}
