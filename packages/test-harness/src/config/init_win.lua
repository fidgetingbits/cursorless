vim.cmd('source C:\\Users\\runneradmin\\BufOnly.vim\\plugin\\BufOnly.vim')

vim.o.runtimepath = vim.o.runtimepath .. ',' .. 'C:\\Users\\runneradmin\\talon.nvim'
vim.o.runtimepath = vim.o.runtimepath
  .. ','
  .. 'C:\\a\\cursorless\\cursorless\\dist\\cursorless.nvim'

require('talon').setup()
require('cursorless').setup()
