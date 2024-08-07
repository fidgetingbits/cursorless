local temp_dir = os.getenv("TEMP_DIR")
local repo_root = os.getenv("CURSORLESS_REPO_ROOT")

vim.opt.runtimepath:append(temp_dir .. "/talon.nvim")
vim.opt.runtimepath:append(repo_root .. "/dist/cursorless.nvim")

require("talon").setup()
require("cursorless").setup()
