# ghub.io

The code behind [ghub.io](http://ghub.io/).

## What

Redirect to a <a href="http://npmjs.org">npm</a> package's <a href="https://github.com">GitHub</a> page, if available.

### Usage

http://ghub.io/<strong>&lt;package-name&gt;</strong>

### Example
[http://ghub.io/review](http://ghub.io/review)

### Pro-Tip: Shell alias

Add this function to your `.bashrc`/`.profile`:

```sh
function module() {
  open "http://ghub.io/$1"
}
```

Then just:

```bash
$ module colors
```

## License

(MIT)
