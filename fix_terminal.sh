#!/bin/bash
# Fixes "command not found" errors for uname, sed, etc.
echo "Fixing PATH..."
export PATH=/usr/bin:$PATH
echo "PATH updated."
which uname
echo "You can now use 'uname' and 'sed'."
