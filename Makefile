NAME = syllabics-for-chrome
VERSION := v$(shell sed -n 's/.*"version":.*"\([^"]*\)",*/\1/p' manifest.json)

ZIPFILE = $(NAME)-$(VERSION).zip
DIST_FILES = manifest.json main.js $(wildcard icon*.png)

.PHONY: all
all: $(ZIPFILE)

.PHONY: zip-for-github-actions
zip-for-github-actions: $(ZIPFILE)
	@echo "::set-output name=archive::$<"

$(ZIPFILE): dist
	cd $< && zip -r ../$@ .

dist: $(DIST_FILES)
	mkdir -p $@/
	cp $^ $@/
	touch $@

.PHONY: clean clean-dist clean-zip
clean: clean-dist clean-zip

clean-zip:
	$(RM) $(wildcard $(NAME)-*.zip)

clean-dist:
	$(RM) -r dist
