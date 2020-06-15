NAME = syllabics-for-chrome
VERSION = $(shell jq -r .version manifest.json)

ZIPFILE = $(NAME)-$(VERSION).zip
DIST_FILES = manifest.json main.js $(wildcard icon*.png)

all: $(ZIPFILE)

$(ZIPFILE): dist
	cd $< && zip -r ../$@ .

.PHONY: dist
dist: $(DIST_FILES)
	mkdir -p $@/
	cp $^ $@/

.PHONY: clean clean-dist clean-zip
clean: clean-dist clean-zip

clean-zip:
	$(RM) $(wildcard $(NAME)-*.zip)

clean-dist:
	$(RM) -r dist
